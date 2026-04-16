import logging
import math
import re
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional

try:
    from nltk.stem import PorterStemmer
    STEMMER = PorterStemmer()
except Exception:
    STEMMER = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TOKEN_PATTERN = re.compile(r"[a-z0-9&]+")
STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is",
    "of", "on", "or", "that", "the", "to", "was", "were", "with", "what",
    "which", "who", "where", "when", "how", "can", "i", "we", "you", "please",
    "tell", "me", "about", "info", "information",
}
SYNONYMS = {
    "clg": "college",
    "engg": "engineering",
    "dept": "department",
    "hod": "head",
    "fees": "fee",
    "admissions": "admission",
    "enquiry": "enquiry",
    "inquiry": "enquiry",
    "aids": "ai&ds",
    "e&tc": "entc",
}


def _normalize_token(token: str) -> str:
    token = token.lower().strip()
    token = SYNONYMS.get(token, token)
    if STEMMER:
        token = STEMMER.stem(token)
    return token


def _tokenize(text: str) -> List[str]:
    raw_tokens = TOKEN_PATTERN.findall((text or "").lower())
    return [
        _normalize_token(token)
        for token in raw_tokens
        if token and token not in STOPWORDS
    ]


class VectorStore:
    """
    Vectorless lexical retrieval with NLP normalization.
    Keeps the same API as the old vector store for drop-in compatibility.
    """

    def __init__(self):
        self.index = None
        self.chunks: List[Dict[str, Any]] = []
        self.chunk_tokens: List[List[str]] = []
        self.chunk_token_counts: List[Counter] = []
        self.idf: Dict[str, float] = {}
        self.intent_question_tokens: Dict[str, List[List[str]]] = defaultdict(list)

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        if not chunks:
            logger.warning("No chunks to add to vectorless store.")
            return

        self.chunks = chunks
        self.chunk_tokens = []
        self.chunk_token_counts = []
        self.intent_question_tokens = defaultdict(list)

        doc_freq = Counter()
        for chunk in chunks:
            text = chunk.get("text", "")
            tokens = _tokenize(text)
            counts = Counter(tokens)

            self.chunk_tokens.append(tokens)
            self.chunk_token_counts.append(counts)
            doc_freq.update(set(tokens))

            metadata = chunk.get("metadata", {})
            intent = metadata.get("tag")
            question = metadata.get("question")
            if intent and question:
                q_tokens = _tokenize(question)
                if q_tokens:
                    self.intent_question_tokens[intent].append(q_tokens)

        n_docs = max(len(chunks), 1)
        self.idf = {
            token: math.log((1 + n_docs) / (1 + freq)) + 1.0
            for token, freq in doc_freq.items()
        }

        self.index = {
            "n_docs": n_docs,
            "avg_doc_len": (
                sum(len(tokens) for tokens in self.chunk_tokens) / n_docs
                if n_docs
                else 0.0
            ),
        }
        logger.info("Vectorless lexical index built successfully.")

    def _overlap_score(self, query_tokens: List[str], doc_counts: Counter) -> float:
        score = 0.0
        for token in query_tokens:
            if token in doc_counts:
                score += self.idf.get(token, 1.0) * (1.0 + math.log1p(doc_counts[token]))
        return score

    def _fuzzy_score(self, query_tokens: List[str], doc_tokens: List[str]) -> float:
        if not query_tokens or not doc_tokens:
            return 0.0

        doc_set = set(doc_tokens)
        fuzzy_total = 0.0
        for token in query_tokens:
            if token in doc_set:
                continue
            best = 0.0
            for candidate in doc_set:
                if abs(len(candidate) - len(token)) > 3:
                    continue
                ratio = SequenceMatcher(None, token, candidate).ratio()
                if ratio > best:
                    best = ratio
            if best >= 0.82:
                fuzzy_total += best
        return fuzzy_total * 0.35

    def _phrase_bonus(self, query: str, text: str) -> float:
        query = (query or "").strip().lower()
        text = (text or "").lower()
        if not query or not text:
            return 0.0
        if query in text:
            return 2.0

        q_words = query.split()
        if len(q_words) >= 2:
            for i in range(len(q_words) - 1):
                bigram = f"{q_words[i]} {q_words[i + 1]}"
                if bigram in text:
                    return 0.9
        return 0.0

    def search(self, query: str, top_k: int = 3, intent_hint: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.index is None:
            logger.error("Index is not initialized. Call add_chunks first.")
            return []

        query_tokens = _tokenize(query)
        if not query_tokens:
            return []

        ranked = []
        for idx, chunk in enumerate(self.chunks):
            text = chunk.get("text", "")
            metadata = chunk.get("metadata", {})
            tokens = self.chunk_tokens[idx]
            token_counts = self.chunk_token_counts[idx]

            score = 0.0
            score += self._overlap_score(query_tokens, token_counts)
            score += self._fuzzy_score(query_tokens, tokens)
            score += self._phrase_bonus(query, text)

            # Slightly boost direct question and summary chunks from canonical data.
            if metadata.get("type") in {"raw_data", "raw_data_question"}:
                score += 0.4
            if metadata.get("type") == "faculty":
                score += 0.2
            if intent_hint and metadata.get("tag") == intent_hint:
                score += 4.0

            if score > 0:
                ranked.append((score, idx))

        ranked.sort(key=lambda item: item[0], reverse=True)
        top = ranked[:top_k]
        return [
            {
                "chunk": self.chunks[idx],
                "score": float(score),
            }
            for score, idx in top
        ]

    def detect_intent(self, query: str) -> Optional[str]:
        """
        Infer intent from query text using only dataset questions (vectorless NLP).
        """
        if not self.intent_question_tokens:
            return None

        query_tokens = _tokenize(query)
        if not query_tokens:
            return None

        best_intent = None
        best_score = 0.0

        for intent, question_variants in self.intent_question_tokens.items():
            intent_score = 0.0
            for variant_tokens in question_variants:
                common = len(set(query_tokens) & set(variant_tokens))
                if not common:
                    continue
                # Precision + recall style signal
                precision = common / max(len(set(query_tokens)), 1)
                recall = common / max(len(set(variant_tokens)), 1)
                score = (2 * precision * recall) / max((precision + recall), 1e-8)
                intent_score = max(intent_score, score)

            if intent_score > best_score:
                best_score = intent_score
                best_intent = intent

        # Conservative threshold to avoid random intent matches.
        if best_score < 0.28:
            return None
        return best_intent


_vector_store = None


def get_vector_store():
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
    return _vector_store
