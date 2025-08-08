import React, { useRef } from "react";
import useAutoFitText from "@/hooks/useAutoFitText";
import defaultAvatar from "@/assets/photo-cover.svg"; // путь подгони под проект

export default function UserCard({ user }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  useAutoFitText(nameRef, { max: 16, min: 12, step: 1, maxLines: 2, deps: [user.name] });
  useAutoFitText(emailRef, { max: 14, min: 10, step: 1, maxLines: 2, deps: [user.email] });

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <article className="user-card">
      <img
        className="user-card__avatar"
        src={user.photo || defaultAvatar}
        alt={`${user.name} photo`}
        loading="lazy"
        onError={handleImageError}
      />
      <div className="user-card__body">
        <h3 ref={nameRef} className="user-card__name" title={user.name}>
          {user.name}
        </h3>
        <p className="user-card__position" title={user.position}>
          {user.position}
        </p>
        <a
          ref={emailRef}
          className="user-card__email"
          title={user.email}
          href={`mailto:${user.email}`}
        >
          {user.email}
        </a>
      </div>
      <a className="user-card__phone" href={`tel:${user.phone.replace(/\s/g, "")}`}>
        {user.phone}
      </a>
    </article>
  );
}
