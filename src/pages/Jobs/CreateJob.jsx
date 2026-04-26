import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import "../../styles/form.css";
import { SKILLS } from "../../constants/skills";
import toast from "react-hot-toast";

function CreateJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Job title is required");
      return;
    }

    const toastId = toast.loading("Saving...");

    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        description,
        requiredSkills: selectedSkills,
        createdAt: new Date(),
      });
      toast.success("Job created", { id: toastId });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">Create New Job</h2>
          <p className="form-subtitle">Add job details and required skills</p>

          <form className="form" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="input-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="Frontend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Company */}
            <div className="input-group">
              <label>Company</label>
              <input
                type="text"
                placeholder="Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="input-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Bangalore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="input-group">
              <label>Job Description</label>
              <textarea
                placeholder="Enter job details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Skills */}
            <div className="input-group">
              <label>Required Skills</label>

              <div className="skills-container">
                {SKILLS.map((skill) => (
                  <label key={skill} className="skill-item">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="form-actions">
              <button className="btn add-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </button>

              <button
                type="button"
                className="btn secondary-btn"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;
