import React, {useEffect, useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const BoardInsertStyle = createGlobalStyle`
  .boardInsert {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-BoardInsert {
    max-width: 330px;
    padding: 15px;
  }

  .form-BoardInsert .form-floating:focus-within {
    z-index: 2;
  }

  .form-BoardInsert input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-BoardInsert input[type="boardPw"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const BoardInsert = () => {
  const [boardId, setBoardId] = useState("");
  const [boardPw, setBoardPw] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [boardDate, setBoardDate] = useState(new Date().toISOString());

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
  const BoardInsertFlow = async () => {

    if (boardTitle === "") {
      alert("Please enter a title");
      return;
    }
    else if (boardContent === "") {
      alert("Please enter a content");
      return;
    }
    else {
      setBoardDate(new Date().toISOString());
      try {
        const res = await axios.post("http://localhost:4000/board/boardInsert", {
          boardId: boardId,
          boardTitle: boardTitle,
          boardContent: boardContent,
          boardDate: boardDate,
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

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <BoardInsertStyle />
      <section className="boardInsert custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Board Insert</h1>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="boardId"
              placeholder="User ID"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              readOnly
            />
            <label htmlFor="boardId">User ID</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="boardPw"
              placeholder="User PW"
              value={boardPw}
              onChange={(e) => setBoardPw(e.target.value)}
              readOnly
            />
            <label htmlFor="boardPw">User PW</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="Title"
              value={boardTitle}
              id="floatingTitle"
              onChange={(e) => {
                setBoardTitle(e.target.value);
              }}
            />
            <label htmlFor="floatingTitle">Title</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="Content"
              value={boardContent}
              id="floatingContent"
              onChange={(e) => {
                setBoardContent(e.target.value);
              }}
            />
            <label htmlFor="floatingContent">Content</label>
          </div>
          <div className="empty-h20"></div>
          {/** date time */}
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="boardDate"
              placeholder="Board Date"
              value={boardDate}
              onChange={(e) => setBoardDate(e.target.value)}
              readOnly
            />
            <label htmlFor="boardDate">Board Date</label>
          </div>
          <div className="empty-h100"></div>
          <button className="w-100 btn btn-lg btn-primary" type="button" onClick={BoardInsertFlow}>
            Insert
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </>
  );
};

export default BoardInsert;