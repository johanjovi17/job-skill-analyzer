import { useEffect, useState } from "react";
import { db, auth } from "../../services/firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/jobs.css";
import { useSkillMatch } from "../../hooks/useSkillMatch";
import toast from "react-hot-toast";

//components
import Spinner from "../../components/Spinner";
import Searchbar from "../../components/Searchbar";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchItem, setSearchItem] = useState("");

  const navigate = useNavigate();
  const jobsCollection = collection(db, "jobs");

  const fetchUserSkills = async () => {
    if (!auth.currentUser) return;

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserSkills(docSnap.data().skills || []);
    }
  };

  const fetchJobs = async () => {
    const data = await getDocs(jobsCollection);

    const jobsList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setJobs(jobsList);
  };

  //searchbar logic
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchItem.toLowerCase()),
  );

  const deleteJob = async (id) => {
    const jobDoc = doc(db, "jobs", id);
    await deleteDoc(jobDoc);
    fetchJobs();
    toast.success("Job deleted successfully!");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchJobs();
        await fetchUserSkills();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div>
            <h2 className="title">Jobs</h2>
            <p className="subtitle">Manage and track your job listings</p>
          </div>

          <Link to="/create" className="btn add-btn">
            + Create Job
          </Link>
        </div>

        <Searchbar searchItem={searchItem} setSearchItem={setSearchItem} />

        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs yet</p>
            <span>Start by creating your first job 🚀</span>
          </div>
        ) : (
          <ul className="job-list">
            {filteredJobs.map((job) => {
              const { missingSkills, matchPercent, matchLevel } = useSkillMatch(
                userSkills,
                job.requiredSkills,
              );

              return (
                <li className="job-card" key={job.id}>
                  <div className="job-left">
                    <span className="job-title">{job.title}</span>

                    {/* Company + Location */}
                    <div className="job-meta">
                      {job.company || "Unknown Company"} •{" "}
                      {job.location || "Unknown Location"}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <div className="job-desc">
                        {job.description.length > 100
                          ? job.description.slice(0, 100) + "..."
                          : job.description}
                      </div>
                    )}

                    {/* Match */}
                    <div className="match-section">
                      <span className={`match-text ${matchLevel}`}>
                        {Math.round(matchPercent)}% Match
                      </span>

                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${matchLevel}`}
                          style={{ width: `${matchPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Missing */}
                    {missingSkills.length > 0 && (
                      <div className="missing-skills">
                        Missing: {missingSkills.join(", ")}
                      </div>
                    )}
                  </div>

                  <div className="actions">
                    <button
                      className="btn edit-btn"
                      onClick={() => navigate(`/edit/${job.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn delete-btn"
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Jobs;
