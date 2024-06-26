import React from "react";

import getRandomColor from "@/utils/random-color-generator";

const UserAvatar = ({
  user,
  size = 50,
}: {
  user: any;
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
            backgroundColor: user.theme || getRandomColor(),
            width: size,
            height: size,
          }}
        >
          {user.username.split(" ").map((name: string) => name[0].toUpperCase()).join("")}
        </div>
      </div>
      <div>
        <p className="text-center text-white text-lg font-medium">{user.username}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
