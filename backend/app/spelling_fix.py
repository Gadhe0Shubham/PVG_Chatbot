try:
    from autocorrect import Speller
    SPELLER_AVAILABLE = True
except ImportError:
    SPELLER_AVAILABLE = False
    print("Warning: autocorrect library not available. Spelling correction disabled.")

def correct_spelling(sequence):
    """
    Correct spelling in the input sequence.
    Falls back to original text if autocorrect is not available.
    """
    if not SPELLER_AVAILABLE:
        return sequence
    
    try:
        spell = Speller()
        words = sequence.split()
        corrected_sequence = []

        for word in words:
            corrected_word = spell(word)
            corrected_sequence.append(corrected_word)

        return ' '.join(corrected_sequence)
    except Exception as e:
        print(f"Spelling correction failed: {e}")
        return sequence
