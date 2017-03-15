const app = {
  evt: null,
  body: null,
  init() {
    app.body = document.querySelector('body');
    app.pieApp = document.querySelector('pie-app');

    // particleground(app.body, {
    //   dotColor: '#fff',
    //   lineColor: '#fff',
    //   density: 20000,
    //   particleRadius: 4
    // });

    app
      .body
      .addEventListener('click', (e) => {
        e.preventDefault();
        app.eventDelegate(e);
      });

    new WOW().init();

    if (document.querySelectorAll('.datepicker').length > 0) {
      app.instantiatePikaday();
    }
    if (document.querySelector('.grid-stack')) {
      app.instantiateGridstack();
    }

    window.onpopstate = () => {
      const path = window.location.pathname;
      app
        .pieApp
        .setAttribute('data-view', path);
    };
  },
  instantiatePikaday() {
    const fields = document.querySelectorAll('.datepicker');
    []
      .forEach
      .call(fields, function(el) {
        new Pikaday({
          field: el,
          minDate: moment().toDate()
        });
      });
  },
  instantiateGridstack() {
    const options = {
      cellHeight: 80,
      verticalMargin: 10
    };
    document
      .querySelector('.grid-stack')
      .gridstack(options);
  },
  eventDelegate(ev) {
    const el = ev.srcElement.target || ev.srcElement.srcElement || ev.target || ev.srcElement;
    const dataAction = el.getAttribute('data-action') || el
      .parentElement
      .getAttribute('data-action');
    const dataToggle = el.getAttribute('data-toggle') || el
      .parentElement
      .getAttribute('data-toggle');
    const dataHref = el.getAttribute('href') || el
      .parentElement
      .getAttribute('href') || null;
    if (el.classList.contains('active') || el.parentElement.classList.contains('active')) {
      return;
    }
    if (dataAction) {
      console.log(dataAction);
      if (app.actions[dataAction]) {
        app
          .actions[dataAction]
          .call(el);
      }
    }
    if (dataHref) {
      console.log(dataHref, el.classList.contains('link'));
      if (dataHref !== 'javascript:;' && !el.classList.contains('link')) {
        app
          .pieApp
          .setAttribute('data-view', dataHref);
        history.pushState(null, null, dataHref);
      } else {
        window.location = `${window.location.origin}${dataHref}`;
      }
    }
    if (dataToggle) {
      console.log(dataToggle);
      document
        .getElementById(dataToggle)
        .classList
        .toggle('active');
    }
  },

  actions: {}
};

app.init();
