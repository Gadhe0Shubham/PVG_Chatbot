try:
    from autocorrect import Speller
    SPELLER_AVAILABLE = True
except ImportError:
    SPELLER_AVAILABLE = False
    print("Warning: autocorrect library not available. Spelling correction disabled.")

if SPELLER_AVAILABLE:
    try:
        # Initialize spell checker once for performance
        spell_checker = Speller(lang='en')
    except Exception as e:
        SPELLER_AVAILABLE = False

def correct_spelling(sequence):
    """
    Correct spelling in the input sequence.
    Avoids correcting capitalized words to protect proper names.
    """
    if not SPELLER_AVAILABLE or not sequence:
        return sequence
    
    try:
        # Simple heuristic: if a word is capitalized, it's likely a name or acronym
        words = sequence.split()
        corrected_words = []
        for word in words:
            # Check if word is capitalized (excluding first word if it's just the start of sentence)
            if word[0].isupper() and word != words[0]:
                corrected_words.append(word)
            elif word[0].isupper() and word == words[0] and len(word) > 1:
                # Still check if it's a name even if at the start
                # but maybe allow correction if it's a common word like 'The'
                corrected_words.append(word)
            else:
                corrected_words.append(spell_checker(word))
        
        return " ".join(corrected_words)
    except Exception:
        return sequence

