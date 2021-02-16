let input = document.getElementById("input");
let submit = document.getElementById("submit");
let form = document.getElementById("input-form");
let im = document.getElementById("initial_message");
let buttons = document.querySelector("#buttons");
let url = new URL(window.location.href);

input.addEventListener("input", function () {
  message = Array.from(this.value);
  if (message.length > 0) {
    submit.style.display = "block";
  } else {
    submit.style.display = "none";
  }
});

submit.onclick = create;
input.addEventListener("keypress", function () {
  if (event.keyCode == 13) {
    create();
    event.returnValue = false;
  }
});

function create() {
  im.style.display = "none";
  submit.style.display = "none";
  fetch('/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        message: input.value
      })
    })
    .then(res => {
      return res.json();
    })
    .then(json => {
      created(json.id);
    });
};

document.getElementsByName("home")[0].onclick = function () {
  reset();
};

function created(id) {
  form.style.display = "none";
  buttons.style.display = "flex";

  console.log(id);
  document.getElementsByName("preview")[0].setAttribute('href', '/' + id);
  document.getElementsByName("LINE")[0].setAttribute('href', 'https://social-plugins.line.me/lineit/share?text=メッセージを作成しました:&url=https://' + url.hostname + '/' + id);
  document.getElementsByName("Twitter")[0].setAttribute('href', 'http://twitter.com/share?hashtags=message_invader&text=メッセージを作成しました:&url=https://' + url.hostname + '/' + id);

};

function reset() {
  form.style.display = "block";
  buttons.style.display = "none";
};