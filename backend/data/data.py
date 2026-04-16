from pathlib import Path
import json

intends_path = Path(__file__).with_name("intends.json")
querys_path = Path(__file__).with_name("querys.json")
responses_path = Path(__file__).with_name("responses.json")
related_path = Path(__file__).with_name("related.json")
raw_data_path = Path(__file__).with_name("raw_data.json")


def _load_json(path: Path, default):
    if not path.exists():
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_from_raw_data(raw_data):
    intents = []
    queries = []
    responses_list = []
    related_list = []

    for item in raw_data:
        intent = item.get("tag")
        if not intent:
            continue

        questions = item.get("questions", [])
        responses = item.get("response", [])
        related = item.get("related", [])

        intents.append(intent)
        queries.append({
            "intent": intent,
            "questions": questions,
        })
        responses_list.append({
            "intent": intent,
            "responses": responses,
        })
        related_list.append({
            "intent": intent,
            "related": related,
        })

    # Preserve order while removing duplicates
    unique_intents = list(dict.fromkeys(intents))
    return unique_intents, queries, responses_list, related_list


raw_data = _load_json(raw_data_path, [])
if raw_data:
    intends, querys, responses, related = _build_from_raw_data(raw_data)
else:
    # Fallback to legacy split files if raw_data is not available.
    intends = _load_json(intends_path, [])
    querys = _load_json(querys_path, [])
    responses = _load_json(responses_path, [])
    related = _load_json(related_path, [])
