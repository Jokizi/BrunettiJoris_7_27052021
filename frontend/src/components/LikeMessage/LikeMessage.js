import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const LikeDislikeMessage = ({ messageId, like, dislike, changeLike }) => {
  const [pushLike, setPushLike] = useState(["far", "thumbs-up"]);
  const [pushDislike, setPushDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (like === 1) {
      setPushLike(["fas", "thumbs-up"]);
    } else if (dislike === 1) {
      setPushDislike(["fas", "thumbs-down"]);
    }
  }, []);

  const onLike = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

      const response = await api({
        url: "/messages/" + messageId + "/vote/like",
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("----------------resData--------------------");
      console.log(response.data);
      console.log("------------------------------------");
      if (response.data === "like ajouté") {
        like = like + 1;
        setPushLike(["fas", "thumbs-up"]);
      } else if (response.data === "like retiré") {
        like = like - 1;
        setPushLike(["far", "thumbs-up"]);
      } else if (response.data === "dislike retiré, like ajouté") {
        like = like + 1;
        setPushLike(["fas", "thumbs-up"]);
        dislike = dislike - 1;
        setPushDislike(["far", "thumbs-down"]);
      }
      changeLike({ messageId, like, dislike });
    } catch (error) {}
  };

  const onDislike = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

      const response = await api({
        url: "/messages/" + messageId + "/vote/dislike",
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("----------------resData----2----------------");
      console.log(response.data);
      console.log("------------------------------------");
      if (response.data === "dislike ajouté") {
        dislike = dislike + 1;
        setPushDislike(["fas", "thumbs-down"]);
      } else if (response.data === "dislike retiré") {
        dislike = dislike - 1;
        setPushDislike(["far", "thumbs-down"]);
      } else if (response.data === "like retiré, dislike ajouté") {
        dislike = dislike + 1;
        setPushDislike(["fas", "thumbs-down"]);
        like = like - 1;
        setPushLike(["far", "thumbs-up"]);
      }
      changeLike({ messageId, like, dislike });
    } catch (error) {}
  };

  return (
    <div>
      <div>
        <FontAwesomeIcon onClick={onLike} color="blue" icon={pushLike} />
        {like}
      </div>
      <div>
        <FontAwesomeIcon onClick={onDislike} color="red" icon={pushDislike} />
        {dislike}
      </div>
    </div>
  );
};
export default LikeDislikeMessage;
