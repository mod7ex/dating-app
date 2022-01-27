import "./import";

let accountDelete = () => {
      let accountDeleteform = document.getElementById("accountDeleteform");

      if (!accountDeleteform) return;

      accountDeleteform.addEventListener("submit", function (e) {
            e.preventDefault();
            let bool = confirm("are you sure ?");
            // @ts-ignore
            if (bool) this.submit();
      });
};
accountDelete();
