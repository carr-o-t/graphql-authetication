import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { InMemoryCache } from "@apollo/client";
import { GraphQLError } from "graphql";
import { Toaster } from "sonner";
import Dashboard from "@/components/dashboard";
import { FOLLOW_USER, GET_CURRENT_USER, LIST_USERS } from "@/lib/graphql-api";

// the logged in user
const me = {
  __typename: "User",
  ID: "1",
  username: "me",
  firstName: "me",
  lastName: "user",
  email: "me@test.com",
  phoneNumber: null,
  followerCount: 0,
  followingCount: 0,
};

// the user to follow
const alice = {
  __typename: "User",
  ID: "2",
  username: "alice",
  firstName: "alice",
  lastName: "smith",
  email: "alice@test.com",
  phoneNumber: null,
  followerCount: 5,
  followingCount: 3,
  isFollowing: false,
};

const queryMocks: MockedResponse[] = [
  { request: { query: GET_CURRENT_USER }, result: { data: { me } } },
  { request: { query: LIST_USERS }, result: { data: { users: [alice] } } },
];

const followSuccess: MockedResponse = {
  request: { query: FOLLOW_USER, variables: { userId: "2" } },
  result: {
    data: {
      followUser: {
        __typename: "FollowRes",
        me: {
          __typename: "User",
          ID: "1",
          username: "me",
          email: "me@test.com",
          followerCount: 0,
          followingCount: 1,
          isFollowing: false,
        },
        followedUser: {
          __typename: "User",
          ID: "2",
          username: "alice",
          email: "alice@test.com",
          followerCount: 6,
          followingCount: 3,
          isFollowing: true,
        },
      },
    },
  },
};

const followError: MockedResponse = {
  request: { query: FOLLOW_USER, variables: { userId: "2" } },
  result: { errors: [new GraphQLError("Simulated failure")] },
  // keep the request open for a moment to see the optimistic state
  delay: 100,
};

function renderDashboard(mutationMock: MockedResponse) {
  // same cache setup as ApolloWrapper so users are normalized by ID
  const cache = new InMemoryCache({
    typePolicies: { User: { keyFields: ["ID"] } },
  });

  render(
    <MockedProvider mocks={[...queryMocks, mutationMock]} cache={cache}>
      <>
        <Dashboard />
        <Toaster />
      </>
    </MockedProvider>
  );
}

// wait until the data has loaded and the Follow button can be clicked
async function getFollowButton() {
  const button = await screen.findByRole("button", { name: "Follow" });
  await waitFor(() => expect(button).toBeEnabled());
  return button;
}

// wait until alice's card shows this follower count
async function expectAliceFollowers(count: number) {
  await waitFor(() =>
    expect(screen.getByTestId("followers-2")).toHaveTextContent(
      `${count}Followers`
    )
  );
}

describe("follow button", () => {
  it("increments the count and says Following after a click", async () => {
    renderDashboard(followSuccess);
    await expectAliceFollowers(5);

    await userEvent.click(await getFollowButton());

    await expectAliceFollowers(6);
    expect(
      await screen.findByRole("button", { name: "Following" })
    ).toBeInTheDocument();
  });

  it("rolls the count back and shows a toast when the mutation fails", async () => {
    renderDashboard(followError);
    await expectAliceFollowers(5);

    await userEvent.click(await getFollowButton());

    // optimistic update shows straight away
    await expectAliceFollowers(6);

    // then the server error rolls it back and the toast appears
    await expectAliceFollowers(5);
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
    expect(
      await screen.findByText("Failed to follow alice: Simulated failure")
    ).toBeInTheDocument();
  });
});
