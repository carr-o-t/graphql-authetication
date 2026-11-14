// remove cookie
export async function removeCookie(key: string) {
  try {
    await fetch("/api/remove-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: key,
      }),
    });
  } catch (e) {
    console.log(e);
  }
}
