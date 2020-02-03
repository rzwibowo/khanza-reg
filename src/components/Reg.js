require('dotenv').config()
const remote = require('electron').remote
const hmac_sha256 = require('crypto-js/hmac-sha256')
const enc_base64 = require('crypto-js/enc-base64')

import '../vendor/vue-popper/vue-popper.min.js'

import { RegInapD } from './RegInapD.js'
import { CariPasienD } from './CariPasienD.js'

import { dbUtil } from '../dbconn.js'

const Reg = {
    template: `
        <div class="container-fluid p-0">
            <div class="row m-0">
                <div class="col-md-3 p-0" v-show="visible">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <h5 class="card-title">Biodata Pasien</h5>
                            <div class="form-group">
                                <label>No. RM</label>
                                <div class="input-group">
                                    <input type="search" class="form-control form-control-sm" 
                                        v-model="pasien.no_rkm_medis" @input="cariPasien">
                                    <div class="input-group-append">
                                        <button class="btn btn-sm btn-outline-secondary" type="button"
                                            @click="dp_visible = !dp_visible">...</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" class="form-control form-control-sm" 
                                    :value="pasien.nm_pasien" readonly>
                            </div>
                            <div class="row align-items-end">
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label>NIK</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.no_ktp" readonly>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-sm btn-outline-secondary" type="button"
                                        @click="cekBpjs" :disabled="!pasien.no_ktp">Cek BPJS</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Alamat</label>
                                <input type="text" class="form-control form-control-sm" 
                                    :value="pasien.alamat_" readonly>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.nm_kec" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.nm_kab" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Status Pasien</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.status" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>No. Asuransi</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.no_peserta" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Lahir</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="pasien.tgl_lahir" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Umur (Th/Bln/Hr)</label>
                                        <div>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" 
                                                :value="pasien.tahun" readonly>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" 
                                                :value="pasien.bulan" readonly>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" 
                                                :value="pasien.hari" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" 
                                    :value="pasien.keluarga" readonly>
                            </div>
                            <div class="form-group">
                                <label>Nama Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" 
                                    :value="pasien.namakeluarga" readonly>
                            </div>
                            <button type="button" class="btn btn-sm btn-secondary">Cetak Kartu</button>
                            <button type="button" class="btn btn-sm btn-secondary">Cetak Form</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 p-0" v-show="visible">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <h5 class="card-title">Entri Kunjungan</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal</label>
                                        <input type="date" class="form-control form-control-sm" 
                                            v-model="reg.tgl_registrasi">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Jam</label>
                                        <input type="time" class="form-control form-control-sm" step="1"
                                            v-model="reg.jam_reg">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Jenis Pembayaran</label>
                                <div>
                                    <input type="text" class="form-control form-control-sm" 
                                        style="display: inline-block; width: 25%;"
                                        v-model="reg.kd_pj">
                                    <select class="form-control form-control-sm" 
                                        style="display: inline-block; width: 70%;"
                                        v-model="reg.kd_pj">
                                        <option v-for="cb in cara_bayars" :key="cb.kd_pj"
                                            :value="cb.kd_pj">
                                            {{ cb.png_jawab }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Asal Rujukan</label>
                                <div>
                                    <input type="text" class="form-control form-control-sm" style="display: inline-block; width: 25%;">
                                    <select class="form-control form-control-sm" style="display: inline-block; width: 70%;"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Ruang Poliklinik</label>
                                <div>
                                    <input type="text" class="form-control form-control-sm" 
                                        style="display: inline-block; width: 25%;"
                                        v-model="reg.kd_poli">
                                    <select class="form-control form-control-sm" 
                                        style="display: inline-block; width: 70%;"
                                        v-model="reg.kd_poli">
                                        <option v-for="pk in polikliniks" :key="pk.kd_poli"
                                            :value="pk.kd_poli">
                                            {{ pk.nm_poli }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Dokter Periksa</label>
                                <div>
                                    <input type="text" class="form-control form-control-sm" 
                                        style="display: inline-block; width: 25%;"
                                        v-model="reg.kd_dokter">
                                    <select class="form-control form-control-sm" 
                                        style="display: inline-block; width: 70%;"
                                        v-model="reg.kd_dokter">
                                        <option v-for="dk in dokters" :key="dk.kd_dokter" 
                                            :value="dk.kd_dokter">
                                            {{ dk.nm_dokter }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right">Simpan</button>
                                <a class="btn btn-sm btn-secondary" href="#/regbaru">Pasien Baru</a>
                                <button type="button" class="btn btn-sm btn-secondary" @click="pasien = {}">Kosongkan</button>
                            </div>
                            <hr>
                            <div class="alert alert-info" role="alert" v-show="Object.keys(info_bpjs).length > 0">
                                <h5>INFORMASI BPJS</h5>
                                <div class="form-group">
                                    <label>No. BPJS</label>
                                    <input type="text" class="form-control-plaintext form-control-sm" 
                                        readonly="readonly" :value="info_bpjs.no_bpjs">
                                </div>
                                <div class="form-group">
                                    <label>Nama</label>
                                    <input type="text" class="form-control-plaintext form-control-sm" 
                                        readonly="readonly" :value="info_bpjs.nama">
                                </div>
                                <div class="form-group">
                                    <label>Jenis</label>
                                    <input type="text" class="form-control-plaintext form-control-sm" 
                                        readonly="readonly" :value="info_bpjs.jenis">
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label>Kelas</label>
                                        <input type="text" class="form-control-plaintext form-control-sm" 
                                            readonly="readonly" :value="info_bpjs.kelas">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Status</label>
                                        <input type="text" class="form-control-plaintext form-control-sm" 
                                            readonly="readonly" :value="info_bpjs.status">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="{'col-md-6': visible, 'col-md-12': !visible}">
                    <div class="row">
                        <div class="col-md-12">
                            <button type="button" class="btn btn-sm btn-secondary" 
                                @click="visible = !visible">{{ visible ? '&lt;' : '&gt;' }} Tugel Form </button>
                            <button type="button" class="btn btn-sm btn-secondary"> Refresh </button>
                            <button type="button" class="btn btn-sm btn-secondary" 
                                @click="di_visible = !di_visible">Open </button>
                        </div>
                    </div>
                    <div class="table-responsive" style="height: 90vh;">
                        <table class="table table-sm table-hover table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>No. Reg</th>
                                    <th>No. RM</th>
                                    <th>Tanggal</th>
                                    <th>Jam</th>
                                    <th>Nama</th>
                                    <th>Umur</th>
                                    <th>Tanggal Lahir</th>
                                    <th>JK</th>
                                    <th>Alamat</th>
                                    <th>Dokter</th>
                                    <th>Klinik</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(pasien, idx) in pasiens" :key="pasien.no_reg"
                                    @click="row_select = idx" :class="{selected: row_select === idx}">
                                    <td>
                                        <popper
                                            trigger="clickToOpen"
                                            :options="{
                                                placement: 'top',
                                                modifiers: { offset: { offset: '0,10px' } }
                                            }"
                                            :visible-arrow="false">
                                            <div class="popper">
                                                <a class="dropdown-item" href="#">Register Rawat Inap</a>
                                            </div>
                                        
                                            <button class="btn btn-secondary btn-sm" slot="reference">
                                                ...
                                            </button>
                                        </popper>
                                    </td>
                                    <td>{{ pasien.no_reg }}</td>
                                    <td>{{ pasien.no_rkm_medis }}</td>
                                    <td>{{ pasien.tgl_registrasi }}</td>
                                    <td>{{ pasien.jam_reg }}</td>
                                    <td>{{ pasien.nm_pasien }}</td>
                                    <td>{{ pasien.umur }}</td>
                                    <td>{{ pasien.tgl_lahir }}</td>
                                    <td>{{ pasien.jk }}</td>
                                    <td>{{ pasien.alamat }}</td>
                                    <td>{{ pasien.nm_dokter }}</td>
                                    <td>{{ pasien.nm_poli }}</td>
                                    <td>{{ pasien.stts_daftar }}</td>
                                </tr>
                                <tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <RegInapD v-show="di_visible" @close="di_visible = false"></RegInapD>
            <CariPasienD v-show="dp_visible" @close="dp_visible = false" @select-p="getData"></CariPasienD>
        </div>
    `,
    components: {
        'popper': VuePopper,
        RegInapD,
        CariPasienD
    },
    data: function () {
        return {
            pasien: {},
            pasiens: [],
            info_bpjs: {},
            reg: {
                tgl_reg: '',
                jam_reg: ''
            },
            cara_bayars: [],
            polikliniks: [],
            dokters: [],
            row_select: null,
            visible: true,
            di_visible: false,
            dp_visible: false
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.getList()
        this.defaultTgl()
        setInterval(() => { this.defaultJam() }, 1000)
        this.getListCaraBayar()
        this.getListPoliklinik()
        this.getListDokter()
    },
    methods: {
        defaultTgl: function () {
            this.reg.tgl_registrasi = moment().format('YYYY-MM-DD')
        },
        defaultJam: function () {
            this.reg.jam_reg = moment().format('HH:mm:ss')
        },
        //#region Olah Data Pasien
        getList: function () {
            const tglHariIni = moment().format('YYYY-MM-DD')
            const db = new dbUtil()
            db.doQuery(`SELECT
                    aa.no_reg, aa.tgl_registrasi, aa.jam_reg,
                    bb.nm_dokter, cc.no_rkm_medis, cc.nm_pasien, cc.jk,
                    cc.alamat, cc.tgl_lahir, 
                    CONCAT(aa.umurdaftar, ' ', aa.sttsumur) AS umur,
                    dd.nm_poli, aa.stts_daftar
                FROM
                    reg_periksa aa
                LEFT JOIN dokter bb ON
                    aa.kd_dokter = bb.kd_dokter
                LEFT JOIN pasien cc ON
                    aa.no_rkm_medis = cc.no_rkm_medis
                LEFT JOIN poliklinik dd ON
                    aa.kd_poli = dd.kd_poli
                LEFT JOIN penjab ee ON
                    aa.kd_pj = ee.kd_pj
                WHERE
                    dd.kd_poli <> 'IGDK'
                    AND tgl_registrasi = '${tglHariIni}'
                ORDER BY
                    aa.tgl_registrasi, aa.jam_reg DESC`)
                .then(res => {
                    this.pasiens = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getData: function (noRm) {
            const tglHariIni = moment().format('YYYY-MM-DD')
            const db = new dbUtil()
            db.doQuery(`SELECT
                    nm_pasien, no_ktp, CONCAT(alamat, ', ', bb.nm_kel) AS alamat_,
                    cc.nm_kec, dd.nm_kab, namakeluarga, keluarga,
                    IF(tgl_daftar = '${tglHariIni}', 'Baru', 'Lama') AS status,
                    no_peserta, tgl_lahir, 
                    TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) AS tahun,
                    (TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                        - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) DIV 12) * 12)) AS bulan,
                    TIMESTAMPDIFF(DAY, DATE_ADD(
                        DATE_ADD(tgl_lahir, INTERVAL TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) YEAR),
                        INTERVAL TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                            - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) DIV 12) * 12) MONTH),
                        CURDATE()) AS hari,
                    keluarga,
                    namakeluarga
                FROM
                    pasien aa
                LEFT JOIN kelurahan bb ON
                    aa.kd_kel = bb.kd_kel
                LEFT JOIN kecamatan cc ON
                    aa.kd_kec = cc.kd_kec
                LEFT JOIN kabupaten dd ON
                    aa.kd_kab = dd.kd_kab
                WHERE
                    no_rkm_medis = '${noRm}'`)
                .then(res => {
                    this.pasien = res[0]
                    this.pasien.no_rkm_medis = noRm
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        cariPasien: function () {
            if (this.pasien.no_rkm_medis.length >= 6) {
                this.getData(this.pasien.no_rkm_medis)
            } else if (this.pasien.no_rkm_medis.length === 0) {
                this.pasien = {}
            }
        },
        cekBpjs: function () {
            const url = process.env.VC_URL
            const id = process.env.VC_ID
            const secret = process.env.VC_KEY
            const timestamp = moment().unix()
            const salt = `${id}&${timestamp}`
            const signature = enc_base64.stringify(hmac_sha256(salt, secret))

            axios.get(`${url}/Peserta/nik/${this.pasien.nik}/tglSEP/${moment().format('YYYY-MM-DD')}`,
                {
                    'headers': {
                        'X-cons-id': id,
                        'X-timestamp': timestamp,
                        'X-signature': signature
                    }
                })
                .then(res => {
                    if (!res.data.response) {
                        alert(res.data.metaData.message)
                    } else {
                        const peserta = res.data.response.peserta
                        this.info_bpjs = {
                            status: peserta.statusPeserta.keterangan,
                            nama: peserta.nama,
                            no_bpjs: peserta.noKartu,
                            jenis: peserta.jenisPeserta.keterangan,
                            kelas: peserta.hakKelas.keterangan
                        }
                    }
                })
                .catch(err => alert(err))
        },
        //#endregion Olah Data Pasien
        getListCaraBayar: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_pj, png_jawab
                FROM
                    penjab`)
                .then(res => {
                    this.cara_bayars = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListPoliklinik: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_poli, nm_poli
                FROM
                    poliklinik
                WHERE
                    status = '1'`)
                .then(res => {
                    this.polikliniks = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListDokter: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_dokter, nm_dokter
                FROM
                    dokter
                WHERE
                    status = '1'`)
                .then(res => {
                    this.dokters = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        setWindowTitle: function () {
            const name = require('./package.json').name
            remote.getCurrentWindow().setTitle(`${name} | Registrasi Rawat Jalan`)
        }
    }
}

export { Reg }