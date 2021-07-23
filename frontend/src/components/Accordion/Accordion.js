import { useState } from "react";
import "./Accordion.css";
import api from "../../Config/Api";

const Accordion = ({ title, messageId, allComments, setAllComments }) => {
  const [active, setActive] = useState(false);

  const getAllComments = async (e) => {
    if (sessionStorage.getItem("test")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

      try {
        const response = await api({
          url: "/" + messageId + "/comments",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("----------------getComments--------------------");
        console.log(response.data);
        console.log("------------------------------------");
        setAllComments(response.data);
      } catch (error) {}
    }
    setActive(!active);
  };
  return (
    <div className={`accordion ${active && "active"}`}>
      <div className="accordion__title" onClick={getAllComments}>
        {title} <span className="accordion__icon"></span>
      </div>
      <div className="accordion__content">
        {allComments.map((element) => {
          return (
            <div key={element.id}>
              <div>{element.createdAt}</div>
              <div>{element.User.username}</div>
              <div>{element.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Accordion;
