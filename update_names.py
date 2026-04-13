import json

# Read the raw_data.json file
with open('backend/data/raw_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Replace all instances of "Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management" with full forms
def replace_in_data(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            obj[key] = replace_in_data(value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            obj[i] = replace_in_data(item)
    elif isinstance(obj, str):
        return obj.replace("Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management", "Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management")
    return obj

# Apply replacements
updated_data = replace_in_data(data)

# Write back to file
with open('backend/data/raw_data.json', 'w', encoding='utf-8') as file:
    json.dump(updated_data, file, indent=4, ensure_ascii=False)

print("Successfully updated all instances of Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management with full forms!")