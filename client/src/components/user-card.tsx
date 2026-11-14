import { FC, useTransition } from "react";
import { useMutation } from "@apollo/client";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/lib/graphql-api";
import { AUTH_TOKEN_KEY } from "@/config";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface UserCardProps {
  firstName: string;
  lastName?: string;
  username: string;
  email?: string;
  ID: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  currentUser?: {
    ID?: string;
    username?: string;
    email?: string;
    followerCount?: number;
    followingCount?: number;
  };
  refetch?: any;
  refetchCurrentUser?: any;
  isFollowable?: boolean;
}

interface StatProps {
  value: number;
  label: string;
  testId: string;
}

const Stat = ({ value, label, testId }: StatProps) => (
  <div data-testid={testId} style={{ flex: 1 }}>
    <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "#fafafa" }}>
      {value ?? 0}
    </p>
    <p style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>{label}</p>
  </div>
);

const UserCard: FC<UserCardProps> = ({
  currentUser,
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
  // wait for the current user
  const isDisabled = isPending || mutationLoading || !currentUser?.ID;

  function handleFollowUser() {
    const isFollowing = item.isFollowing;
    // toggle: if we already follow this user then unfollow
    const mutate = isFollowing ? unfollowUser : followUser;

    // optimistic payload
    const optimisticResponse = {
      __typename: "Mutation",
      [isFollowing ? "unfollowUser" : "followUser"]: {
        __typename: "FollowRes",
        me: {
          __typename: "User",
          ID: currentUser?.ID,
          username: currentUser?.username,
          email: currentUser?.email,
          followerCount: currentUser?.followerCount ?? 0,
          followingCount:
            (currentUser?.followingCount ?? 0) + (isFollowing ? -1 : 1),
          isFollowing: false,
        },
        followedUser: {
          __typename: "User",
          ID: item.ID,
          username: item.username,
          email: item.email,
          followerCount: (item.followerCount ?? 0) + (isFollowing ? -1 : 1),
          followingCount: item.followingCount ?? 0,
          isFollowing: !isFollowing,
        },
      },
    };

    startTransition(() => {
      toast.promise(
        async () =>
          await mutate({ variables: { userId: item.ID }, optimisticResponse }),
        {
        loading: "updating! please wait...",
        success: () => {
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
      elevation={0}
      style={{
        // width: "100%",
        background: "#27272f",
        color: "#fafafa",
        border: "1px solid #27272a",
        borderRadius: "12px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "2.75rem",
            height: "2.75rem",
            flexShrink: 0,
            borderRadius: "100%",
            backgroundColor: "#27272a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          {item.firstName?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontWeight: 600,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.firstName} {item.lastName}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#a1a1aa",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            @{item.username}
          </p>
        </div>
        {!isFollowable && (
          <span
            style={{
              padding: "0.125rem 0.625rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "#fafafa",
              color: "#18181b",
            }}
          >
            You
          </span>
        )}
      </div>

      {/* follower / following counts */}
      <div
        style={{
          display: "flex",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          backgroundColor: "#18181b",
        }}
      >
        <Stat
          value={item.followerCount}
          label="Followers"
          testId={`followers-${item.ID}`}
        />
        <Stat
          value={item.followingCount}
          label="Following"
          testId={`following-${item.ID}`}
        />
      </div>

      {isFollowable && (
        <Button
          fullWidth
          variant="contained"
          disableElevation
          disabled={isDisabled}
          onClick={handleFollowUser}
          style={{
            // white when you can follow, outlined once you already follow
            backgroundColor: item.isFollowing ? "#37373d" : "#fafafa",
            color: item.isFollowing ? "#fafafa" : "#18181b",
            border: item.isFollowing ? "1px solid #27272a" : "1px solid #fafafa",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 500,
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          {item.isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </Card>
  );
};

export default UserCard;
