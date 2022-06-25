import React, { Component } from "react";

import $ from "jquery";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default class Invoice extends Component {
  constructor() {
    super();
    this.state = {
      id_pembayaran: "",
      nisn: "",
      tgl_bayar: "",
      bulan_dibayar: "",
      tahun_dibayar: "",
      id_spp: "",
      jumlah_bayar: "",
      id_petugas: "",
      nama_petugas: "",
      nama_siswa: "",
      kelas: "",
      nominal: "",
    };
  }
  getData = () => {
    this.setState({
      id_pembayaran: localStorage.getItem("id_pembayaran"),
      nisn: localStorage.getItem("nisn"),
      tgl_bayar: localStorage.getItem("tgl_bayar"),
      bulan_dibayar: localStorage.getItem("bulan_dibayar"),
      tahun_dibayar: localStorage.getItem("tahun_dibayar"),
      id_spp: localStorage.getItem("id_spp"),
      jumlah_bayar: localStorage.getItem("jumlah_bayar"),
      id_petugas: localStorage.getItem("id_petugas"),
      nama_petugas: localStorage.getItem("nama_petugas"),
      nama_siswa: localStorage.getItem("nama_siswa"),
      kelas: localStorage.getItem("kelas"),
      nominal: localStorage.getItem("nominal"),
    });
  };

  getPDF = (ev) => {
    ev.preventDefault();
    var HTML_Width = $("article").width();
    var HTML_Height = $("article").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + top_left_margin * 2;
    var PDF_Height = PDF_Width * 1 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("article")[0], { allowTaint: true }).then(function (canvas) {
      canvas.getContext("2d");
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("Invoice.pdf");
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <>
        <article>
          <div className="pt-5 sm:pt-0 bg-white h-full">
            <div class="max-w-7xl mx-auto">
              <div class="p-10 font-mono">
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div class="flex flex-col">
                    <h2 class="text-4xl sm:py-5">{this.state.nama_siswa}</h2>
                    <span class="text-gray-500">{this.state.nisn}</span>
                  </div>

                  <div class="flex flex-col sm:justify-end sm:items-end">
                    <h2 class="text-4xl text-gray-500 sm:py-5">
                      Payment Receipt
                    </h2>

                    <dl class="max-w-1/2">
                      <div class="grid grid-cols-2 items-end">
                        <dt class="text-gray-500 ">Payment ID</dt>
                        <dd class="text-right">{this.state.id_pembayaran}</dd>
                      </div>
                      <div class="grid grid-cols-2">
                        <dt class="text-gray-500">Date paid</dt>
                        <dd class="text-right">{this.state.tgl_bayar}</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="md:col-span-2">
                    <h4 class="text-lg">Authorized by</h4>
                    <p class="text-gray-500">{this.state.nama_petugas}</p>
                    <p class="text-gray-500">{this.state.id_petugas}</p>
                  </div>
                </div>

                <div class="flex flex-col">
                  <h1 class="py-10 sm:py-20 text-3xl">
                    Rp{this.state.jumlah_bayar} paid on {this.state.tgl_bayar}
                  </h1>

                  <div class="overflow-scroll">
                    <table class="min-w-full">
                      <thead class="text-bold">
                        <tr>
                          <th scope="col" class="text-left w-2/5 sm:px-8 py-4">
                            Description
                          </th>
                          <th scope="col" class="text-left w-1/5 sm:px-8 py-4">
                            Month & Year
                          </th>
                          <th scope="col" class="text-left w-1/5 sm:px-8 py-4">
                            Amount
                          </th>
                          <th scope="col" class="text-right w-1/5 sm:px-8 py-4">
                            Total Paid
                          </th>
                        </tr>
                      </thead>

                      <tbody class="divide-y divide-gray-200">
                        <tr class="text-left bg-gray-50">
                          <td class="sm:px-8 py-4">
                            Spp {this.state.kelas} Payment
                          </td>
                          <td class="sm:px-8 py-4">
                            {this.state.bulan_dibayar} /{" "}
                            {this.state.tahun_dibayar}
                          </td>
                          <td class="sm:px-8 py-4">{this.state.nominal}</td>
                          <td class="sm:px-8 py-4 text-right">
                            {this.state.jumlah_bayar}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" class="">
                            &nbsp;
                          </td>
                          <td class="sm:px-8 py-4">Change</td>
                          <td class="sm:px-8 py-4 text-right">
                            {this.state.jumlah_bayar > this.state.nominal
                              ? this.state.jumlah_bayar - this.state.nominal
                              : 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <div className="px-6 py-2">
          <button
            className="bg-green-500 text-white active:bg-indigo-600
font-bold uppercase text-sm px-6 py-3 rounded shadow
hover:shadow-lg outline-none focus:outline-none mr-1 mb-1
ease-linear transition-all duration-150"
            type="button"
          >
            <a
              href="#generate-invoice-pdf"
              target="_blank"
              class="inline-flex items-center text-sm font-medium"
              onClick={(ev) => this.getPDF(ev)}
              style={{ textDecoration: "none", color: "white" }}
            >
              {" "}
              Download PDF{" "}
              <svg
                class="ml-0.5 h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </a>
          </button>
        </div>
      </>
    );
  }
}
