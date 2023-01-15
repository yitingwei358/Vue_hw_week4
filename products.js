import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";

let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  methods: {
    checkAdmin() {
      const url = `${this.api}/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "login.html";
        });
    },
    // page=1為預設值
    getData(page = 1) {
      const url = `${this.api}/api/${this.path}/admin/products?page=${page}`;

      axios
        .get(url)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "login.html";
        });
    },

    // Bootstrap5 互動視窗 Modal
    openModal(effect, item) {
      // 建立新的產品時先清空 tempProduct 內的資料，避免上一筆沒儲存的資料仍顯示出來
      if (effect === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (effect === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (effect === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
  },
  components: {
    pagination,
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
});

// 元件
// 產品新增/編輯元件
app.component("productModal", {
  template: "#productModal",
  props: ["product", "isNew"],
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
    };
  },
  mounted() {
    //打開 productModal，{ keyboard: false } 讓按下 esc 時視窗不會關掉
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
  },
  methods: {
    updateItem() {
      let url = `${this.api}/api/${this.path}/admin/product`;
      let http = "post";
      if (!this.isNew) {
        http = "put";
        url = `${this.api}/api/${this.path}/admin/product/${this.product.id}`;
      }

      axios[http](url, { data: this.product })
        .then((res) => {
          alert(res.data.message);
          this.hideModal();
          this.$emit("update");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push("");
    },
    openModal() {
      productModal.show();
    },
    hideModal() {
      productModal.hide();
    },
  },
});

// 產品刪除元件
app.component("delProductModal", {
  template: "#delProductModal",
  props: ["item"], //tempProduct傳進來變item
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
    };
  },
  mounted() {
    //打開 delProductModal
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      { keyboard: false, backdrop: "static" }
    );
  },
  methods: {
    deleteItem() {
      const url = `${this.api}/api/${this.path}/admin/product/${this.item.id}`;

      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          //成功後關掉互動視窗，並重新取得資料
          this.hideModal();
          this.$emit("update");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});

app.mount("#app");
