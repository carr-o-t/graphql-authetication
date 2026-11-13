import { FC, useTransition } from "react";
import { useMutation } from "@apollo/client";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/lib/graphql-api";
import { AUTH_TOKEN_KEY } from "@/config";
import Cookies from "js-cookie";
import { toast } from "sonner";

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
  isFollowing?: boolean;
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
  const token = Cookies.get(AUTH_TOKEN_KEY);

  // run on the app's apollo provider client, so the results flow into the cache
  const withAuthContext = {
    context: {
      headers: {
        Authorization: token,
      },
    },
  };
  const [followUser, { loading: followLoading }] = useMutation(
    FOLLOW_USER,
    withAuthContext
  );
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW_USER,
    withAuthContext
  );
  const mutationLoading = followLoading || unfollowLoading;

  function handleFollowUser() {
    const isFollowing = item.isFollowing;
    // toggle: if we already follow this user then unfollow
    const mutate = isFollowing ? unfollowUser : followUser;

    startTransition(() => {
      toast.promise(async () => await mutate({ variables: { userId: item.ID } }), {
        loading: "updating! please wait...",
        success: () => {
          refetch();
          refetchCurrentUser();
          return isFollowing
            ? `You unfollowed ${item.username}`
            : `You followed ${item.username}`;
        },
        error: (error: any) => {
          // show error toast for server error
          const reason =
            error?.graphQLErrors?.[0]?.message || error?.message || "";
          return reason
            ? `Failed to ${isFollowing ? "unfollow" : "follow"} ${item.username}: ${reason}`
            : `Failed to ${isFollowing ? "unfollow" : "follow"} ${item.username}`;
        },
      });
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
              disabled={isPending || mutationLoading}
              onClick={handleFollowUser}
            >
              {item.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        </CardActions>
      )}
    </Card>
  );
};

export default UserCard;
