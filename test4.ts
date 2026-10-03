async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/publications');
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data.substring(0, 100));
  } catch (err) {
    console.error(err);
  }
}
test();
