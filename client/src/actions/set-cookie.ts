export async function setCookie(key: string, value: string, expiry: number) {
  try {
    await fetch(process.env.NEXT_PUBLIC_URL_FE + "/api/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: key,
        token: value,
        token_expiry: expiry,
      }),
    });
    // console.log("COOKIE SET INSIDE SET COOKIE ::: ", key, value, expiry);
  } catch (e) {
    console.log(e);
  }
}
