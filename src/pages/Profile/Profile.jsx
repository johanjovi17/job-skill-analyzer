import { useState } from "react";
import { db, auth } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import "../../styles/profile.css";
import { SKILLS } from "../../constants/skills";
import Spinner from "../../components/Spinner";

function Profile() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      setMessage("");

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        skills: selectedSkills,
      });

      setMessage("Saved successfully ✅");
    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="form-container">
        <div className="profile-card">
          <h2 className="profile-title">Your Skills</h2>

          {/* Helpful message */}
          <p className="profile-subtitle">
            Select your skills to get job match insights
          </p>

          <div className="skills-container">
            {SKILLS.map((skill) => (
              <label key={skill} className="skill-item">
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>

          {/* Button */}
          <button
            className="profile-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Save Skills"}
          </button>

          {/* Message */}
          {message && <p className="status-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;