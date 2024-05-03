import React from "react";

import getRandomColor from "@/utils/random-color-generator";

const UserAvatar = ({
  username,
  size = 50,
}: {
  username: string;
  size?: number,
}) => {
  return (
    <div className="flex flex-col gap-3 max-w-32">
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="
            flex
            items-center
            justify-center
            text-white
            font-medium
            rounded-full
          "
          style={{
            backgroundColor: getRandomColor(),
            width: size,
            height: size,
          }}
        >
          {username.split(" ").map((name) => name[0].toUpperCase()).join("")}
        </div>
      </div>
      <div>
        <p className="text-center text-white text-lg font-medium">{username}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
