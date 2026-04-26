import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../../styles/form.css";
import { SKILLS } from "../../constants/skills";
import toast from "react-hot-toast";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch job
  const fetchJob = async () => {
    const jobRef = doc(db, "jobs", id);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      const data = jobSnap.data();
      setTitle(data.title || "");
      setCompany(data.company || "");
      setLocation(data.location || "");
      setDescription(data.description || "");
      setSelectedSkills(data.requiredSkills || []);
    }
  };

  // Update job
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title) return;

    const toastId = toast.loading("Saving...");

    try {
      setLoading(true);

      const jobRef = doc(db, "jobs", id);

      await updateDoc(jobRef, {
        title,
        company,
        location,
        description,
        requiredSkills: selectedSkills,
      });
      toast.success("Job updated successfully", { id: toastId });

      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
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

  useEffect(() => {
    fetchJob();
  }, []);

  return (
    <div className="page">
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">Edit Job</h2>
          <p className="form-subtitle">Update job details and skills</p>

          <form className="form" onSubmit={handleUpdate}>
            {/* Title */}
            <div className="input-group">
              <label>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Company */}
            <div className="input-group">
              <label>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="input-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="input-group">
              <label>Description</label>
              <textarea
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

            {/* Actions */}
            <div className="form-actions">
              <button className="btn add-btn" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Job"}
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
