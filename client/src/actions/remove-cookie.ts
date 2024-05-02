// remove cookie
export async function removeCookie(key: string) {
  try {
    await fetch(process.env.NEXT_PUBLIC_URL_FE + "/api/remove-cookie", {
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
