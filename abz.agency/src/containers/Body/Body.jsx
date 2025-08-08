import React, {useRef} from "react";
import FotoSection from "./main/FotoSection/FotoSection";
import GETRequest from "./main/GETRequest/GETRequset";
import PostForm from "./main/POSTRequest/POSTRequest";
const Body = () => {

    const refetchFirstPageRef = useRef(null);
  return (
    <>
      <FotoSection />
      <GETRequest refetchFirstPageRef={refetchFirstPageRef} />
      <PostForm onRegistered={() => refetchFirstPageRef.current?.()}/>
    </>
  );
};

export default Body;