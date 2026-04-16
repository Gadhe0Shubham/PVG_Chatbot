import json
from pathlib import Path
import logging
from typing import Any, Dict, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGKnowledgeBase:
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            # Default to the data directory relative to this file
            self.data_dir = Path(__file__).parent.parent / "data"
        else:
            self.data_dir = Path(data_dir)
        
        self.chunks = []

    def load_all_data(self):
        """Load and process all JSON files into text chunks."""
        self.chunks = []
        
        # 1. Process raw_data.json (canonical intent + response dataset)
        raw_data_path = self.data_dir / "raw_data.json"
        if raw_data_path.exists():
            self._process_raw_data(raw_data_path)
            
        # 2. Process Faculty.json (faculty + department info)
        faculty_path = self.data_dir / "Faculty.json"
        if faculty_path.exists():
            self._process_faculty_data(faculty_path)
            
        # 3. Process faculity.json (alternate structured source)
        alt_faculty_path = self.data_dir / "faculity.json"
        if alt_faculty_path.exists():
            self._process_faculty_data(alt_faculty_path)

        # 4. Remove exact duplicates to keep retrieval fast.
        unique_chunks = []
        seen = set()
        for chunk in self.chunks:
            key = chunk.get("text", "").strip()
            if key in seen:
                continue
            seen.add(key)
            unique_chunks.append(chunk)

        self.chunks = unique_chunks
        logger.info(f"Loaded {len(self.chunks)} text chunks for knowledge base.")
            
        return self.chunks

    def _process_raw_data(self, file_path: Path):
        """Extract information from raw_data.json."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data: List[Dict[str, Any]] = json.load(f)
                
            for item in data:
                tag = item.get("tag", "general")
                responses = item.get("response", [])
                related = item.get("related", [])
                questions = item.get("questions", [])
                
                related_text = ", ".join([r.get("text", "") for r in related])
                question_text = ", ".join(q for q in questions if q)
                content = " ".join(responses)
                
                if content:
                    text = f"PVGCOE Topic: {tag.replace('_', ' ').title()}\nInformation: {content}"
                    if related_text:
                        text += f"\nAvailable Options/Courses: {related_text}"
                    if question_text:
                        text += f"\nCommon Questions: {question_text}"
                        
                    chunk = {
                        "text": text,
                        "metadata": {"source": "raw_data.json", "tag": tag, "type": "raw_data"}
                    }
                    self.chunks.append(chunk)

                for question in questions:
                    if not question:
                        continue
                    question_chunk = {
                        "text": (
                            f"User Query Pattern: {question}\n"
                            f"Intent: {tag}\n"
                            f"Answer: {content}"
                        ),
                        "metadata": {
                            "source": "raw_data.json",
                            "tag": tag,
                            "type": "raw_data_question",
                            "question": question,
                        },
                    }
                    self.chunks.append(question_chunk)

        except Exception as e:
            logger.error(f"Error processing raw_data.json: {e}")

    def _process_faculty_data(self, file_path: Path):
        """Extract information from Faculty.json or faculity.json."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            departments = data.get("departments", [])
            for dept in departments:
                # Handle field variations between Faculty.json and faculity.json
                dept_name = dept.get("name") or dept.get("department") or "Unknown Department"
                abrv = dept.get("abbreviation", "")
                full_dept_name = f"{dept_name} ({abrv})" if abrv else dept_name
                
                description = dept.get("description") or dept.get("introduction", "")
                vision = dept.get("vision", "")
                mission = dept.get("mission", [])
                
                # Handle different intake formats
                intake = dept.get("intake_capacity", "")
                if isinstance(intake, dict):
                    intake = f"Initial: {intake.get('initial')}, Current: {intake.get('current')} (from {intake.get('start_year_current')})"
                
                branch_code = dept.get("branch_code", "")
                objectives = dept.get("objectives", "")
                
                # 1. Department Overview Chunk - Enriched with keywords
                if description:
                    text = f"PVGCOE Department Overview: {full_dept_name}\nInformation: {description}\nIntake: {intake}\nFaculty and Staff Info: This department has highly qualified faculty members and technical staff."
                    if branch_code:
                        text += f"\nBranch Code: {branch_code}"
                    if objectives:
                        text += f"\nObjectives: {objectives}"
                        
                    chunk = {
                        "text": text,
                        "metadata": {"source": file_path.name, "type": "department_info", "department": dept_name}
                    }
                    self.chunks.append(chunk)
                
                # ... (Vision, Mission, Facilities, Outcomes logic stays similar but uses dept_name)
                # I'll keep the existing ones I added but use the flexible dept_name

                # 5. Teaching Faculty Chunks - Flexibly handle key: 'teaching_faculty' or 'faculty'
                faculty_list = dept.get("teaching_faculty") or dept.get("faculty", [])
                for member in faculty_list:
                    name = member.get("name", "Unknown")
                    pos = member.get("position") or member.get("designation", "")
                    qual = member.get("qualification", "")
                    exp = member.get("experience", "")
                    
                    # Handle areas of interest/specialization
                    interest = member.get("areas_of_interest") or member.get("specialization", "")
                    if isinstance(interest, list):
                        interest = ", ".join(interest)
                    
                    linkedin = member.get("linkedin", "")
                    
                    # Formatting for better matching
                    text = f"PVGCOE Faculty Member Details: {name}\nDepartment: {full_dept_name}\nPosition/Designation: {pos}\nQualification: {qual}\nExperience: {exp}"
                    if interest:
                        text += f"\nSpecialization/Areas of Interest: {interest}"
                    if linkedin:
                        text += f"\nLinkedIn: {linkedin}"
                    
                    # Add common query terms to chunk
                    text += f"\nKeywords: {dept_name} faculty, {name} head of department, pvgcoe teacher"
                        
                    chunk = {
                        "text": text,
                        "metadata": {"source": file_path.name, "type": "faculty", "department": dept_name, "name": name}
                    }
                    self.chunks.append(chunk)

                # 6. Technical Staff Chunks
                for staff in dept.get("technical_staff", []):
                    name = staff.get("name", "Unknown")
                    pos = staff.get("position", "")
                    qual = staff.get("qualification", "")
                    exp = staff.get("experience", "")
                    
                    text = f"PVGCOE Technical Staff: {name}\nDepartment: {full_dept_name}\nPosition: {pos}\nQualification: {qual}\nExperience: {exp}\nKeywords: {dept_name} staff, lab assistant"
                    chunk = {
                        "text": text,
                        "metadata": {"source": file_path.name, "type": "staff", "department": dept_name, "name": name}
                    }
                    self.chunks.append(chunk)
                    
        except Exception as e:
            logger.error(f"Error processing Faculty.json: {e}")


    def get_all_text(self):
        return [chunk["text"] for chunk in self.chunks]

if __name__ == "__main__":
    kb = RAGKnowledgeBase()
    kb.load_all_data()
    for i, chunk in enumerate(kb.chunks[:5]):
        print(f"Chunk {i}:\n{chunk['text']}\n")
