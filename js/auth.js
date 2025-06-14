function protectPage(redirectTo = "/") {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Your Session expired, please Login...");
    window.location.href = redirectTo;
  }
}
window.addEventListener("load", () => {
    protectPage();
});