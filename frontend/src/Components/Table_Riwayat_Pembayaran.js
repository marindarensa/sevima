import axios from "axios";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { base_url } from "../Config.js";

class Riwayat_Pembayaran extends React.Component {
  constructor() {
    super();
    this.state = {
      token: "",
      userData: "",
      data_pembayaran: [],
      message: "",
      found: "",
      id_pembayaran: "",
      id_petugas: "",
      nisn: "",
      tgl_bayar: "",
      bulan_dibayar: "",
      tahun_dibayar: "",
      id_spp: "",
      jumlah_bayar: "",
      modal: "hidden",
      action: "",
      invoice: [],
    };
    // dapetin token dari localstorage
    if (localStorage.getItem("token")) {
      this.state.token = localStorage.getItem("token");
    } else {
      // token ga ada, redirect ke laman login
      window.location = "/login";
    }
  }

  getUser = () => {
    let userdata = JSON.parse(localStorage.getItem("user"));
    this.setState({
      userData: userdata,
      id_petugas: userdata.id_petugas,
    });
  };

  getDataPembayaran = () => {
    let url = base_url + "/pembayaran";
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + this.state.token,
        },
      })
      .then((response) => {
        this.setState({
          found: response.data.found,
        });
        if (this.state.found) {
          let data_pembayaran = JSON.parse(
            JSON.stringify(response.data.pembayaran)
          );
          this.setState({
            data_pembayaran: data_pembayaran,
          });
        } else {
          this.setState({
            message: response.data.message,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  addData = () => {
    // const today = new Date();
    // const date =
    //   today.getFullYear() +
    //   "-" +
    //   (today.getMonth() + 1) +
    //   "-" +
    //   today.getDate();
    // const time =
    //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // const dateTime = date + " " + time;
    const today = moment().format("MMMM Do YYYY");
    this.toggleModal(true);
    this.setState({
      action: "add",
      id_pembayaran: "",
      nisn: "",
      tgl_bayar: today,
      bulan_dibayar: "",
      tahun_dibayar: "",
      id_spp: "",
      jumlah_bayar: "",
    });
  };
  updateData = (selectedItem) => {
    this.toggleModal(true);
    this.setState({
      action: "update",
      id_pembayaran: selectedItem.id_pembayaran,
      id_petugas: selectedItem.id_petugas,
      nisn: selectedItem.nisn,
      tgl_bayar: selectedItem.tgl_bayar,
      bulan_dibayar: selectedItem.bulan_dibayar,
      tahun_dibayar: selectedItem.tahun_dibayar,
      id_spp: selectedItem.id_spp,
      jumlah_bayar: selectedItem.jumlah_bayar,
    });
  };

  downloadFile = (selectedItem) => {
    this.setState({
      id_pembayaran: selectedItem.id_pembayaran,
      id_petugas: selectedItem.id_petugas,
      nisn: selectedItem.nisn,
      tgl_bayar: selectedItem.tgl_bayar,
      bulan_dibayar: selectedItem.bulan_dibayar,
      tahun_dibayar: selectedItem.tahun_dibayar,
      id_spp: selectedItem.id_spp,
      jumlah_bayar: selectedItem.jumlah_bayar,
    });
    localStorage.setItem("id_pembayaran", selectedItem.id_pembayaran);
    localStorage.setItem("nisn", selectedItem.nisn);
    localStorage.setItem("tgl_bayar", selectedItem.tgl_bayar);
    localStorage.setItem("bulan_dibayar", selectedItem.bulan_dibayar);
    localStorage.setItem("tahun_dibayar", selectedItem.tahun_dibayar);
    localStorage.setItem("id_spp", selectedItem.id_spp);
    localStorage.setItem("jumlah_bayar", selectedItem.jumlah_bayar);
    localStorage.setItem("id_petugas", selectedItem.id_petugas);
    localStorage.setItem("nama_petugas", selectedItem.petugas.nama_petugas);
    localStorage.setItem("nama_siswa", selectedItem.siswa.nama);
    localStorage.setItem("kelas", selectedItem.spp.kelas);
    localStorage.setItem("nominal", selectedItem.spp.nominal);
  };
  dropData = (selectedItem) => {
    if (window.confirm("Yakin nih dihapus?")) {
      let url = base_url + "/pembayaran/" + selectedItem.id_pembayaran;
      axios
        .delete(url, {
          headers: {
            Authorization: "Bearer " + this.state.token,
          },
        })
        .then((response) => {
          window.alert(response.data.message);
          this.getDataPembayaran();
        })
        .catch((error) => console.log(error));
    }
  };
  save = (event) => {
    event.preventDefault();
    let form = {
      id_pembayaran: this.state.id_pembayaran,
      id_petugas: this.state.id_petugas,
      nisn: this.state.nisn,
      tgl_bayar: this.state.tgl_bayar,
      bulan_dibayar: this.state.bulan_dibayar,
      tahun_dibayar: this.state.tahun_dibayar,
      id_spp: this.state.id_spp,
      jumlah_bayar: this.state.jumlah_bayar,
    };
    let status_update = {
      nisn: form.nisn,
      bulan: form.bulan_dibayar,
      tahun: form.tahun_dibayar,
      status: "lunas",
    };

    let url = base_url + "/pembayaran";
    let tunggakan_url = base_url + "/tunggakan";
    if (this.state.action === "add") {
      axios
        .post(url, form, {
          headers: {
            Authorization: "Bearer " + this.state.token,
          },
        })
        .then((response) => {
          window.alert(response.data.message);
          this.getDataPembayaran();
        })
        .catch((error) => console.log("catch"));

      axios
        .put(tunggakan_url, status_update, {
          headers: {
            Authorization: "Bearer " + this.state.token,
          },
        })
        .then((response) => {
          console.log("status di update");
        })
        .catch((error) => console.log("catch"));
    } else if (this.state.action === "update") {
      axios
        .put(url, form, {
          headers: {
            Authorization: "Bearer " + this.state.token,
          },
        })
        .then((response) => {
          this.getDataPembayaran();
        })
        .catch((error) => console.log(error));
    }
    this.toggleModal(false);
  };
  toggleModal = (modal) => {
    if (modal) {
      this.setState({ modal: "flex" });
    } else {
      this.setState({ modal: "hidden" });
    }
  };

  // getPDF = (ev) => {
  //   ev.preventDefault();
  //   var HTML_Width = $("article").width();
  //   var HTML_Height = $("article").height();
  //   var top_left_margin = 15;
  //   var PDF_Width = HTML_Width + top_left_margin * 2;
  //   var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  //   var canvas_image_width = HTML_Width;
  //   var canvas_image_height = HTML_Height;
  //   var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  //   html2canvas($("article")[0], { allowTaint: true }).then(function (canvas) {
  //     canvas.getContext("2d");
  //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
  //     pdf.addImage(
  //       imgData,
  //       "JPG",
  //       top_left_margin,
  //       top_left_margin,
  //       canvas_image_width,
  //       canvas_image_height
  //     );
  //     for (var i = 1; i <= totalPDFPages; i++) {
  //       pdf.addPage(PDF_Width, PDF_Height);
  //       pdf.addImage(
  //         imgData,
  //         "JPG",
  //         top_left_margin,
  //         -(PDF_Height * i) + top_left_margin * 4,
  //         canvas_image_width,
  //         canvas_image_height
  //       );
  //     }
  //     pdf.save(`Pembayaran-spp.pdf`);
  //   });
  // };

  componentDidMount() {
    this.getUser();
    this.getDataPembayaran();
  }
  render() {
    return (
      <div>
        <div
          className="mx-auto flex flex-row
items-center justify-between pb-4 border-b border-gray-300"
        >
          <div className="mx-auto">
            <div
              className="flex flex-col md:flex-row
items-start md:items-center text-gray-600 text-sm"
            >
              <div className="flex items-center">
                <h4
                  className="text-2xl font-bold
leading-tight text-gray-800 text-center"
                >
                  Riwayat Pembayaran Siswa
                </h4>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => this.addData()}
              className="transition duration-150 ease-in-out hover:bg-indigo-600
focus:outline-none border bg-indigo-700 rounded text-white px-8
py-2 text-sm"
            >
              Tambah Data
            </button>
            {/* Modal */}
            <div
              className={`${this.state.modal} 
justify-center items-center flex overflow-x-hidden overflow-y-auto
fixed inset-0 z-50 outline-none focus:outline-none`}
            >
              <div
                className="relative w-auto my-6
mx-auto max-w-3xl"
              >
                {/*content*/}
                <div
                  className="border-0 rounded-lg
shadow-lg relative flex flex-col w-full glass outline-none
focus:outline-none"
                >
                  {/*body*/}
                  <div
                    className="relative p-6
flex-auto"
                  >
                    <div
                      class="mt-10
sm:mt-0"
                    >
                      <div
                        class="md:grid
md:grid-cols-3 md:gap-6"
                      >
                        <div class="md:col-span-1">
                          <div class="px-4 sm:px-0">
                            <h3
                              class="text-lg font-medium leading-6
text-gray-900"
                            >
                              {this.state.action.toUpperCase()} Pembayaran
                            </h3>
                            <p class="mt-1 text-sm text-gray-600">
                              Gunakan untuk {this.state.action.toUpperCase()}{" "}
                              Pembayaran
                              <br />
                              <br />
                              Syarat Penggunaan: <br />- Wajib memasukan semua
                              kolom
                            </p>
                          </div>
                        </div>
                        <div
                          class="mt-5
md:mt-0 md:col-span-2"
                        >
                          <form method="POST" onSubmit={(ev) => this.save(ev)}>
                            <div class="shadow overflow-hidden sm:rounded-md">
                              <div class="px-4 py-5 bg-white sm:p-6">
                                <div class="grid grid-cols-6 gap-6">
                                  <div class="col-span-6 sm:col-span-6">
                                    <label
                                      for="nisn"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      NISN
                                    </label>
                                    <input
                                      type="number"
                                      name="nisn"
                                      id="nisn"
                                      autocomplete="nisn"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.nisn}
                                      onChange={(ev) =>
                                        this.setState({ nisn: ev.target.value })
                                      }
                                      required
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="id_petugas"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      Petugas
                                    </label>
                                    <input
                                      type="text"
                                      name="id_petugas"
                                      id="id_petugas"
                                      autocomplete="id_petugas"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-500 "
                                      value={this.state.userData.nama_petugas}
                                      required
                                      disabled
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="tgl_bayar"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      Tanggal Bayar
                                    </label>
                                    <input
                                      type="text"
                                      name="tgl_bayar"
                                      id="tgl_bayar"
                                      autocomplete="tgl_bayar"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.tgl_bayar}
                                      onChange={(ev) =>
                                        this.setState({
                                          tgl_bayar: ev.target.value,
                                        })
                                      }
                                      required
                                      disabled
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="bulan_dibayar"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      Bulan Dibayar
                                    </label>
                                    <input
                                      type="number"
                                      name="bulan_dibayar"
                                      id="bulan_dibayar"
                                      autocomplete="bulan_dibayar"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.bulan_dibayar}
                                      onChange={(ev) =>
                                        this.setState({
                                          bulan_dibayar: ev.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="tahun_dibayar"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      Tahun Dibayar
                                    </label>
                                    <input
                                      type="number"
                                      name="tahun_dibayar"
                                      id="tahun_dibayar"
                                      autocomplete="tahun_dibayar"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.tahun_dibayar}
                                      onChange={(ev) =>
                                        this.setState({
                                          tahun_dibayar: ev.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="id_spp"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      SPP
                                    </label>
                                    <input
                                      type="number"
                                      name="id_spp"
                                      id="id_spp"
                                      autocomplete="id_spp"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.id_spp}
                                      onChange={(ev) =>
                                        this.setState({
                                          id_spp: ev.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div class="col-span-6 sm:col-span-3">
                                    <label
                                      for="jumlah_bayar"
                                      class="block text-sm font-medium
text-gray-700"
                                    >
                                      Jumlah Bayar
                                    </label>
                                    <input
                                      type="number"
                                      name="jumlah_bayar"
                                      id="jumlah_bayar"
                                      autocomplete="jumlah_bayar"
                                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block
w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                      value={this.state.jumlah_bayar}
                                      onChange={(ev) =>
                                        this.setState({
                                          jumlah_bayar: ev.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                  className="text-red-500 background-transparent font-bold uppercase
px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1
ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => this.toggleModal(false)}
                                >
                                  Close
                                </button>
                                <button
                                  className="inline-flex justify-center py-2 px-4 border
border-transparent shadow-sm text-sm font-medium rounded-md
text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none
focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  type="submit"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${this.state.modal}
opacity-25 fixed inset-0 z-40 bg-black`}
            ></div>
          </div>
        </div>
        <div class="flex flex-col">
          <div
            class="-my-2 overflow-x-auto sm:-mx-6
lg:-mx-8"
          >
            <div
              class="py-2 align-middle inline-block
min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="shadow overflow-hidden
border-b border-gray-200 sm:rounded-lg"
              >
                <table
                  class="min-w-full divide-y
divide-gray-200"
                >
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        Nama Siswa
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        Jumlah Bayar
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        Tanggal Bayar
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        Auditor
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Sign</span>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                      >
                        Changes
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white
divide-y divide-gray-200"
                  >
                    {this.state.data_pembayaran.map((item) => (
                      <tr>
                        <td
                          class="px-6
py-4 whitespace-nowrap"
                        >
                          <div class="text-sm text-gray-900">
                            {item.id_pembayaran}
                          </div>
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap"
                        >
                          <div class="text-sm text-gray-900">
                            {item.siswa.nama.toUpperCase()}
                          </div>
                          <div class="text-sm text-gray-500">
                            NISN:
                            {item.siswa.nisn}
                          </div>
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap"
                        >
                          {item.jumlah_bayar >= item.spp.nominal ? (
                            <>
                              {item.jumlah_bayar === item.spp.nominal ? (
                                <div class="text-sm text-gray-900">
                                  Rp{item.jumlah_bayar}
                                </div>
                              ) : (
                                <>
                                  <div class="text-sm text-gray-900">
                                    Rp{item.jumlah_bayar} - Rp{item.spp.nominal}
                                  </div>
                                  <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold
rounded-full bg-yellow-100 text-yellow-800"
                                  >
                                    Kembali: Rp
                                    {item.jumlah_bayar - item.spp.nominal}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <div class="text-sm text-gray-900">
                                Rp{item.jumlah_bayar} - Rp{item.spp.nominal}
                              </div>
                              <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold
rounded-full bg-red-100 text-red-800"
                              >
                                Kurang: Rp{item.spp.nominal - item.jumlah_bayar}
                              </span>
                            </>
                          )}
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap"
                        >
                          <div class="text-sm text-gray-900">
                            {item.tgl_bayar}
                          </div>
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {item.petugas.nama_petugas.toUpperCase()}
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap text-right text-sm font-medium"
                        >
                          {item.jumlah_bayar < item.spp.nominal ? (
                            <span
                              class="px-2 inline-flex text-xs leading-5 font-semibold
rounded-full bg-red-100 text-red-800"
                            >
                              Belum Lunas
                            </span>
                          ) : (
                            <span
                              class="px-2 inline-flex text-xs leading-5 font-semibold
rounded-full bg-green-100 text-green-800"
                            >
                              Lunas
                            </span>
                          )}
                        </td>
                        <td
                          class="px-6
py-4 whitespace-nowrap"
                        >
                          <ul
                            className="flex flex-col md:flex-row items-start md:items-center
text-gray-600 text-sm mt-3"
                          >
                            <li className="flex items-center mr-3 mt-3 md:mt-0">
                              <span className="mr-2">
                                <button
                                  className="bg-indigo-500 text-white active:bg-indigo-600
font-bold uppercase text-sm px-6 py-3 rounded shadow
hover:shadow-lg outline-none focus:outline-none mr-1 mb-1
ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => this.updateData(item)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-pencil-square"
                                    viewBox="0 0 16
16"
                                  >
                                    <path
                                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459
3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75
2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0
.316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5
1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0
1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1
2.5v11z"
                                    />
                                  </svg>
                                </button>
                              </span>
                            </li>
                            <li className="flex items-center mr-3 mt-3 md:mt-0">
                              <span className="mr-2">
                                <button
                                  className="bg-red-500 text-white active:bg-red-600
font-bold uppercase text-sm px-6 py-3 rounded shadow
hover:shadow-lg outline-none focus:outline-none mr-1 mb-1
ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => this.dropData(item)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-trash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1
.5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1
.5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0
1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0
0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1
1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5
3V2h11v1h-11z"
                                    />
                                  </svg>
                                </button>
                              </span>
                            </li>
                            <li className="flex items-center mr-3 mt-3 md:mt-0">
                              <span className="mr-2">
                                <Link to="/invoice">
                                  <button
                                    className="bg-green-500 text-white active:bg-indigo-600
font-bold uppercase text-sm px-6 py-3 rounded shadow
hover:shadow-lg outline-none focus:outline-none mr-1 mb-1
ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => this.downloadFile(item)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 384 512"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                    >
                                      <path d="M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z" />
                                    </svg>
                                  </button>
                                </Link>
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Riwayat_Pembayaran;
