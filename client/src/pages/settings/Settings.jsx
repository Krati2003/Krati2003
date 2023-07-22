import "./settings.css";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);

  const { user, dispatch } = useContext(Context);
  const PF = "http://localhost:5000/images/"

  useEffect(() => {
      setUsername(user.user.username);
      setEmail(user.user.email)
      setPassword(user.user.password);
  }, []);

  const handleDelete = async () => {
    try{
      await axios.delete("/users/" + user.user._id, {
        data: { userId: user.user._id },
        headers: { authorization: "Bearer "+ user.accessToken}
      })
      dispatch({ type: "LOGOUT" });
      window.location.replace("/login");
    } catch (err){
      setFailure(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId: user.user._id,
      username,
      email,
      password,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const postsData = await axios.get("/posts?user=" + user.user.username);
      await axios.put("/users/" + user.user._id, updatedUser, {
        headers: { authorization: "Bearer "+ user.accessToken}
      });
      const posts = postsData.data;
      posts.map(async (p) => (
        await axios.put("/posts/" + p._id, {
          username: username
        }, {
          headers: { authorization: "Bearer "+ user.accessToken}
        })
      ))
      dispatch({ type: "LOGOUT" });
      window.location.replace("/login");
    } catch (err) {
      setFailure(true);
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Account</span>
          <span className="settingsDeleteTitle" onClick={handleDelete}>Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
          { (user.user.profilePic === "") ? (
                <img 
                  src={ file ? URL.createObjectURL(file) : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="} alt="" /> 
              ): (
                <img
              src={file ? URL.createObjectURL(file) : PF+user.user.profilePic}
              alt=""
            />
              )
            }
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            defaultValue={user.user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            defaultValue={user.user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder={"type a new password..."}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {failure && (
            <span
              style={{ color: "red", textAlign: "center", marginTop: "20px" }}
            >
              Something went wrong...
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
