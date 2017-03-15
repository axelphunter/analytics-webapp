const sideNav = {
  init() {
    const menuItems = document.querySelectorAll('.sidebar-menu .dropdown');
    menuItems.forEach((el) => {
      el.onclick = () => {
        sideNav.expandDropdown(el);
      }
    });
  },

  expandDropdown(el) {
    el
      .classList
      .toggle('open');
  }
};

sideNav.init();
