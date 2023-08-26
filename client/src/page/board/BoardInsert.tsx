// BoardInsert.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const BoardInsert = () => {
  const [user_id, setBoardId] = useState("");
  const [boardPw, setBoardPw] = useState("");
  const [board_title, setBoardTitle] = useState("");
  const [board_content, setBoardContent] = useState("");
  const [board_regdate, setBoardDate] = useState(new Date().toISOString());

  // ---------------------------------------------------------------------------------------------->
  const fetchBoardInsert = async () => {
    const user_id = window.sessionStorage.getItem("user_id");
     try {
      const res = await axios.post("http://localhost:4000/user/userDetail", {
        user_id : user_id,
      });

      if (res.status === 200) {
        const {user_id, user_pw} = res.data;
        setBoardId(user_id);
        setBoardPw(user_pw);
      }
      else {
        throw new Error("Server responded with an error");
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchBoardInsert();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const BoardInsertTable = () => {
    return (
      <>
      <div className="form-floating">
        <input type="text"
          className="form-control"
          id="user_id"
          placeholder="User ID"
          value={user_id}
          onChange={(e) => setBoardId(e.target.value)}
          readOnly
        />
        <label htmlFor="user_id">User ID</label>
      </div>
      <div className="empty-h20"></div>
      <div className="form-floating">
        <input type="text"
          className="form-control"
          id="boardPw"
          placeholder="User PW"
          value={boardPw}
          readOnly
          onChange={(e) => {
            setBoardPw(e.target.value);
          }}
        />
        <label htmlFor="boardPw">User PW</label>
      </div>
      <div className="empty-h20"></div>
      <div className="form-floating">
        <input type="text"
          className="form-control"
          placeholder="Title"
          value={board_title}
          id="floatingTitle"
          onChange={(e) => {
            setBoardTitle(e.target.value);
          }}
        />
        <label htmlFor="floatingTitle">Title</label>
      </div>
      <div className="empty-h20"></div>
      <div className="form-floating">
        <input type="text"
          className="form-control"
          placeholder="Content"
          value={board_content}
          id="floatingContent"
          onChange={(e) => {
            setBoardContent(e.target.value);
          }}
        />
        <label htmlFor="floatingContent">Content</label>
      </div>
      <div className="empty-h20"></div>
      <div className="form-floating">
        <input type="text"
          className="form-control"
          id="board_regdate"
          placeholder="Board Date"
          value={board_regdate}
          readOnly
          onChange={(e) => {
            setBoardDate(e.target.value);
          }}
        />
        <label htmlFor="board_regdate">Board Date</label>
      </div>
      <div className="empty-h50"></div>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const BoardInsertFlow = async () => {

    if (board_title === "") {
      alert("Please enter a title");
      return;
    }
    else if (board_content === "") {
      alert("Please enter a content");
      return;
    }
    else {
      setBoardDate(new Date().toISOString().split('T')[0]);
      try {
        const res = await axios.post("http://localhost:4000/board/boardInsert", {
          user_id: user_id,
          board_title: board_title,
          board_content: board_content,
          board_regdate: board_regdate,
        });

        if (res.data === "success") {
          alert("Insert a board successfully");
          window.location.href = "/boardList";
        }
        else if (res.data === "fail") {
          alert("Insert a board failed");
        }
        else {
          alert(`${res.data}error`);
        }
      }
      catch (err) {
        console.error(err);
        alert("Insert a board failed");
      }
    }
  };

  const buttonBoardInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={BoardInsertFlow}>
        Insert
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3">Board Insert</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form  className="form-inline">
            {BoardInsertTable()}
            <div className="empty-h50"></div>
            {buttonBoardInsert()}
          </form>
        </div>
      </div>
      <div className="empty-h200"></div>
    </div>
  );
};

export default BoardInsert;