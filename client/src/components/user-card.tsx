import { FC, useTransition } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { followUser } from "@/actions/follow-user";
import { toast } from "sonner";
import { client } from "./ApolloWrapper";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface UserCardProps {
  firstName: string;
  username: string;
  ID: string;
  followerCount: number;
  followingCount: number;
  refetch?: any;
  refetchCurrentUser?: any;
  isFollowable?: boolean;
}

const UserCard: FC<UserCardProps> = ({
  refetch,
  refetchCurrentUser,
  isFollowable = true,
  ...item
}) => {
  const [isPending, startTransition] = useTransition();

  function handleFollowUser() {
    client.refetchQueries({});
    startTransition(() => {
      toast.promise(
        async () => await followUser(item.ID, item.username),
        // .then((data: any) => {
        //   console.log(data);
        // })
        // .catch((error: any) => {
        //   const e = error;
        //   console.log(e)
        // }),
        {
          loading: "updating! please wait...",
          success: () => {
            refetch();
            refetchCurrentUser();
            return `You followed ${item.username}`;
          },
          error: "Error",
        }
      );
    });
  }
  return (
    <Card
      className="w-[400px] shadow-md"
      style={{
        maxWidth: "400px",
        width: "100%",
        background: "#1c1c1cfb",
        color: "white",
        position: "relative",
      }}
    >
      {!isFollowable && (
        <div
          className=""
          style={{
            padding: "0.2rem 0.5rem",
            position: "absolute",
            fontSize: "12px",
            borderRadius: "100vw",
            top: "1rem",
            left: "1rem",
            backgroundColor: "rgb(16 185 129 / 0.15)", // Assuming Tailwind uses custom color variables
            color: "rgb(16 185 129",
          }}
        >
          YOU
        </div>
      )}
      {/* <CardHeader> */}
      {/* <Header label={headerLabel} header={headerHeading} /> */}
      <div
        className="w-full flex flex-col gap-y-4 items-center justify-center"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem", // Adjust gap size as needed
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <h1
          className={cn("text-3xl font-semibold", font.className)}
          style={{
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
            fontWeight: "600",
            margin: 0,
            textTransform: "capitalize",
          }}
        >
          {item?.firstName}
        </h1>
        <p
          className="text-muted-foreground text-sm"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: "hsl(215 20.2% 65.1%)",
          }}
        >
          username: {item?.username}
        </p>
      </div>
      <div
        className="w-full flex gap-4 items-center justify-between"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem", // Adjust gap size as needed
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <p
          className="text-muted-foreground text-sm"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: "hsl(215 20.2% 65.1%)",
          }}
        >
          followers: {item?.followerCount}
        </p>
        <p
          className="text-muted-foreground text-sm"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: "hsl(215 20.2% 65.1%)",
          }}
        >
          following: {item?.followingCount}
        </p>
      </div>
      {/* </CardHeader> */}
      {/* <CardContent>{children}</CardContent> */}
      {isFollowable && (
        <CardActions>
          <div
            className=""
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              type="submit"
              className="w-full"
              variant="outlined"
              // style={{ color: "#9957ff" }}
              disabled={isPending}
              onClick={handleFollowUser}
            >
              Follow
            </Button>
          </div>
        </CardActions>
      )}
    </Card>
  );
};

export default UserCard;
