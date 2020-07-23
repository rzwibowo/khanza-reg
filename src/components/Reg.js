require('dotenv').config()
const remote = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
const hmac_sha256 = require('crypto-js/hmac-sha256')
const enc_base64 = require('crypto-js/enc-base64')
const contextMenu = require('electron-context-menu')

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
                                        v-model="pasien.no_rkm_medis" @input="cariPasien"
                                        :class="{'is-invalid': validasi[0]}">
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
                            <button type="button" class="btn btn-sm btn-secondary" 
                                @click="cetakKartu" :disabled="!pasien.no_rkm_medis">Cetak Kartu</button>
                            <!-- dalam perencanaan --
                            <button type="button" class="btn btn-sm btn-secondary">Cetak Form</button>
                            -->
                        </div>
                    </div>
                </div>
                <div class="col-md-3 p-0" v-show="visible">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <h5 class="card-title">Entri Kunjungan</h5>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>No. Reg</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            v-model="reg.no_reg" readonly>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label>No. Rawat</label>
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="reg.no_rawat" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal</label>
                                        <input type="date" class="form-control form-control-sm" 
                                            v-model="reg.tgl_registrasi" @change="genNoReg();genNoRawat();">
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
                                        v-model="reg.kd_pj" :class="{'is-invalid': validasi[0]}">
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
                                    <input type="text" class="form-control form-control-sm" 
                                        style="display: inline-block; width: 25%;"
                                        v-model="reg.perujuk">
                                    <select class="form-control form-control-sm" 
                                        style="display: inline-block; width: 70%;"
                                        v-model="reg.perujuk">
                                        <option value="-">-</option>
                                        <option v-for="(rj, index) in rujukans" :key="index"
                                            :value="rj.perujuk">
                                            {{ rj.perujuk }}
                                        </option>
                                    </select>
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
                                        v-model="reg.kd_poli" @change="genNoReg();genNoRawat();"
                                        :class="{'is-invalid': validasi[0]}">
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
                                        v-model="reg.kd_dokter" :class="{'is-invalid': validasi[0]}">
                                        <option v-for="dk in dokters" :key="dk.kd_dokter" 
                                            :value="dk.kd_dokter">
                                            {{ dk.nm_dokter }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right"
                                    @click="saveReg" :disabled="is_loading">
                                    <span class="spinner-border spinner-border-sm" 
                                        role="status" aria-hidden="true" v-show="is_loading"></span>
                                    <span v-show="!is_loading">Simpan</span>
                                </button>
                                <a class="btn btn-sm btn-secondary" href="#/regbaru">Pasien Baru</a>
                                <button type="button" class="btn btn-sm btn-secondary" 
                                    @click="kosongkan">
                                    Kosongkan
                                </button>
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
                        <div :class="{'col-md-4': visible, 'col-md-2': !visible}">
                            <button type="button" class="btn btn-sm btn-secondary" 
                                @click="visible = !visible"
                                :title="visible ? 'Sembunyikan form' : 'Tampilkan form'">
                                {{ visible ? '◄' : '►' }}
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary" @click="getList"> Refresh </button>
                        </div>
                        <div :class="{'col-md-4': visible, 'col-md-2': !visible}">
                            <input type="date" class="form-control form-control-sm" 
                                v-model="tgl_awal" @change="getList">
                        </div>
                        <div :class="{'col-md-4': visible, 'col-md-2': !visible}">
                            <input type="date" class="form-control form-control-sm"
                                v-model="tgl_akhir" @change="getList">
                        </div>
                        <div :class="{'col-md-6': visible, 'col-md-2': !visible}">
                            <select class="form-control form-control-sm" 
                                v-model="klinik_cari" @change="filterPasien">
                                <option value="-">SEMUA</option>
                                <option v-for="pk in polikliniks" :key="pk.kd_poli"
                                    :value="pk.kd_poli">
                                    {{ pk.nm_poli }}
                                </option>
                            </select>
                        </div>
                        <div :class="{'col-md-6': visible, 'col-md-4': !visible}">
                            <div class="input-group">
                                <input type="search" class="form-control form-control-sm" 
                                    placeholder="Cari ..." v-model="cari" 
                                    @input="if (cari.length >= 3 || cari.length === 0) { filterPasien() }">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary btn-sm" 
                                        type="button" @click="filterPasien">&#x1F50D;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive" :class="{'h85vh': visible, 'h90vh': !visible}">
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
                                <template v-for="(pasien, idx) in pasiens_f" :key="pasien.no_reg">
                                    <tr @click="row_select = idx" :class="{selected: row_select === idx}">
                                        <td>
                                            <button class="btn btn-secondary btn-sm btn-action" 
                                                @click="act_visible === idx ? act_visible = null : act_visible = idx">
                                                <span v-show="act_visible !== idx">▼</span>
                                                <span v-show="act_visible === idx">▲</span>
                                            </button>
                                        </td>
                                        <td title="data-pasien">{{ pasien.no_reg }}</td>
                                        <td title="data-pasien">{{ pasien.no_rkm_medis }}</td>
                                        <td title="data-pasien" style="white-space: nowrap">{{ moment(pasien.tgl_registrasi).format('DD-MM-YYYY') }}</td>
                                        <td title="data-pasien">{{ pasien.jam_reg }}</td>
                                        <td title="data-pasien" style="white-space: nowrap">{{ pasien.nm_pasien }}</td>
                                        <td title="data-pasien">{{ pasien.umur }}</td>
                                        <td title="data-pasien" style="white-space: nowrap">{{ moment(pasien.tgl_lahir).format('DD-MM-YYYY') }}</td>
                                        <td title="data-pasien">{{ pasien.jk }}</td>
                                        <td title="data-pasien">{{ pasien.alamat }}</td>
                                        <td title="data-pasien" style="white-space: nowrap">{{ pasien.nm_dokter }}</td>
                                        <td title="data-pasien" style="white-space: nowrap">{{ pasien.nm_poli }}</td>
                                        <td title="data-pasien">{{ pasien.stts_daftar }}</td>
                                    </tr>
                                    <tr v-show="act_visible === idx" style="background-color: #C8E6C9;">
                                        <td colspan="13">
                                            <button type="button" class="btn btn-link btn-sm" 
                                                @click="inap(pasien)">
                                                Register Rawat Inap
                                            </button>
                                            <button type="button" class="btn btn-link btn-sm"
                                                @click="ubah(pasien)">
                                                Ubah
                                            </button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <label>Total Pasien: {{pasiens_f.length}}</label>
                </div>
            </div>
            <RegInapD v-show="di_visible" @close="di_visible = false" 
                :no-rm="selected_pasien.no_rm" :nama="selected_pasien.nama"
                :no-rawat="selected_pasien.no_rawat"
                :searchable="false"></RegInapD>
            <CariPasienD v-show="dp_visible" @close="dp_visible = false" @select-p="getData"></CariPasienD>
        </div>
    `,
    components: {
        RegInapD,
        CariPasienD
    },
    data: function () {
        return {
            tgl_awal: '',
            tgl_akhir: '',
            klinik_cari: '-',
            cari: '',
            pasien: {
                no_rkm_medis: null
            },
            pasiens: [],
            pasiens_f: [],
            info_bpjs: {},
            reg: {
                tgl_registrasi: null,
                jam_reg: null,
                kd_pj: null,
                kd_poli: null,
                kd_dokter: null
            },
            cara_bayars: [],
            polikliniks: [],
            dokters: [],
            rujukans: [],
            row_select: null,
            act_visible: null,
            visible: true,
            di_visible: false,
            dp_visible: false,
            selected_pasien: {},
            is_loading: false,
            is_edit: false,
            validasi: [false, false, false, false] 
                // utk no RM, cara bayar, ruang klinik, dokter
                // jika semua true, tidak valid
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.defaultTgl()
        this.defaultRm()
        this.defaultTglList()
        this.getList()
        setInterval(() => { this.defaultJam() }, 1000)
        this.genNoReg()
        this.genNoRawat()
        this.getListCaraBayar()
        this.getListPoliklinik()
        this.getListDokter()
        this.getListRujukan()
        this.initContextMenu()
    },
    methods: {
        defaultTglList: function () {
            this.tgl_awal = this.tgl_akhir = moment().format('YYYY-MM-DD')
        },
        defaultTgl: function () {
            this.reg.tgl_registrasi = moment().format('YYYY-MM-DD')
        },
        defaultJam: function () {
            this.reg.jam_reg = moment().format('HH:mm:ss')
        },
        defaultRm: function () {
            if (this.$route.params.no_rm) {
                this.pasien.no_rkm_medis = this.$route.params.no_rm
                this.cariPasien()
            }
        },
        //#region Olah Data Pasien
        getList: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    aa.no_reg, aa.tgl_registrasi, aa.jam_reg, no_rawat,
                    bb.nm_dokter, cc.no_rkm_medis, cc.nm_pasien, cc.jk,
                    cc.alamat, cc.tgl_lahir, 
                    CONCAT(aa.umurdaftar, ' ', aa.sttsumur) AS umur,
                    aa.kd_poli, dd.nm_poli, aa.stts, aa.stts_daftar
                FROM
                    reg_periksa aa
                    LEFT JOIN dokter bb ON aa.kd_dokter = bb.kd_dokter
                    LEFT JOIN pasien cc ON aa.no_rkm_medis = cc.no_rkm_medis
                    LEFT JOIN poliklinik dd ON aa.kd_poli = dd.kd_poli
                    LEFT JOIN penjab ee ON aa.kd_pj = ee.kd_pj
                WHERE
                    dd.kd_poli <> 'IGDK'
                    AND tgl_registrasi BETWEEN '${this.tgl_awal}' AND '${this.tgl_akhir}'
                ORDER BY
                    aa.tgl_registrasi, aa.jam_reg DESC`)
                .then(res => {
                    this.row_select = null
                    this.pasiens = res
                    this.klinik_cari = '-'
                    this.cari = ''
                    this.filterPasien()
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { 
                        alert('Gagal ambil daftar pasien, ' + err)
                        throw err 
                    })
                })
                .catch(err => {
                    alert('Gagal ambil daftar pasien, ' + err)
                    console.error(err)
                })
        },
        filterPasien: function () {
            this.pasiens_f = this.pasiens
            if (this.klinik_cari !== '-') {
                this.pasiens_f = this.pasiens_f.filter(item => { 
                    return item.kd_poli === this.klinik_cari 
                })
            }
            if (this.cari) {
                const keyword = this.cari.trim().toLowerCase()
                this.pasiens_f = this.pasiens_f.filter(item => { 
                    return item.nm_pasien.trim().toLowerCase().includes(keyword)
                        || item.no_rkm_medis.trim().toLowerCase().includes(keyword)
                        || item.alamat.trim().toLowerCase().includes(keyword)
                        || item.nm_dokter.trim().toLowerCase().includes(keyword)
                })
            }
        },
        getData: function (noRm) {
            const tglHariIni = moment().format('YYYY-MM-DD')
            const db = new dbUtil()
            db.doQuery(`SELECT
                    nm_pasien, no_ktp, CONCAT(alamat, ', ', bb.nm_kel) AS alamat_,
                    cc.nm_kec, dd.nm_kab, namakeluarga, keluarga, alamatpj,
                    IF(tgl_daftar = '${tglHariIni}', 'Baru', 'Lama') AS status,
                    no_peserta, tgl_lahir, jk, ee.png_jawab, tgl_daftar,
                    TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) AS tahun,
                    (TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                        - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) DIV 12) * 12)) AS bulan,
                    TIMESTAMPDIFF(DAY, DATE_ADD(
                        DATE_ADD(tgl_lahir, INTERVAL TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) YEAR),
                        INTERVAL TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                            - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) DIV 12) * 12) MONTH),
                        CURDATE()) AS hari
                FROM
                    pasien aa
                    LEFT JOIN kelurahan bb ON aa.kd_kel = bb.kd_kel
                    LEFT JOIN kecamatan cc ON aa.kd_kec = cc.kd_kec
                    LEFT JOIN kabupaten dd ON aa.kd_kab = dd.kd_kab
                    LEFT JOIN penjab ee ON aa.kd_pj = ee.kd_pj
                WHERE
                    no_rkm_medis = '${noRm}'`)
                .then(res => {
                    this.pasien = res[0]
                    this.pasien.no_rkm_medis = noRm
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { 
                        alert('Gagal ambil data pasien, ' + err)
                        throw err 
                    })
                })
                .catch(err => {
                    alert('Gagal ambil data pasien, ' + err)
                    console.error(err)
                })
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
        //#region Data Combobox
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
                    kd_poli, nm_poli, registrasi, registrasilama
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
        getListRujukan: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                        perujuk
                    FROM
                        rujuk_masuk
                    GROUP BY
                        perujuk`)
                .then(res => {
                    this.rujukans = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        //#endregion Data Combobox
        cekValid: async function () {
            const db = new dbUtil()
            let inap = false

            await db.doQuery(`SELECT 
                    COUNT(aa.no_rkm_medis) AS jumlah
                FROM pasien aa
                    LEFT JOIN reg_periksa bb ON bb.no_rkm_medis = aa.no_rkm_medis
                    LEFT JOIN kamar_inap cc ON bb.no_rawat = cc.no_rawat
                WHERE cc.stts_pulang = '-' 
                    AND aa.no_rkm_medis = '${this.pasien.no_rkm_medis}'`)
                .then(res => {
                    res[0].jumlah > 0 ? inap = true : inap = false
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))

            if (!this.pasien.no_rkm_medis || this.pasien.no_rkm_medis.length < 6) {
                this.validasi[0] = true
                alert("No. MR tidak boleh kosong atau kurang dari 6 karakter")
            } else if (!this.reg.kd_pj) {
                this.validasi[1] = true
                alert("Jenis pembayaran tidak boleh kosong")
            } else if (!this.reg.kd_poli) {
                this.validasi[2] = true
                alert("Ruang poliklinik tidak boleh kosong")
            } else if (!this.reg.kd_dokter) {
                this.validasi[3] = true
                alert("Dokter tidak boleh kosong")
            } else if (inap) {
                alert("Pasien masih rawat inap")
            } else {
                this.validasi = [false, false, false, false]
            }

            const valid = this.validasi.reduce((final_res, item) => { 
                return final_res || item 
            })

            return valid
        },
        saveReg: async function () {
            let invalid
            this.cekValid().then(res => invalid = res)

            if (!invalid) {
                const db = new dbUtil()

                this.is_loading = true

                const biaya = this.pasien.status === 'Lama'
                    ? this.polikliniks.filter(item => {
                        return item.kd_poli === this.reg.kd_poli
                    })[0].registrasilama
                    : this.polikliniks.filter(item => {
                        return item.kd_poli === this.reg.kd_poli
                    })[0].registrasi

                let umur = 0
                let statusumur = 'Th'

                if (this.pasien.tahun > 0) {
                    umur = this.pasien.tahun
                    statusumur = 'Th'
                } else {
                    if (this.pasien.bulan > 0) {
                        umur = this.pasien.bulan
                        statusumur = 'Bl'
                    } else {
                        umur = this.pasien.hari
                        statusumur = 'Hr'
                    }
                }

                if (!this.is_edit) {
                    let status_poli = ''
                    await db.doQuery(`SELECT 
                            COUNT(no_rkm_medis) AS jml_periksa_poli 
                        FROM 
                            reg_periksa 
                        WHERE 
                            no_rkm_medis = '${this.pasien.no_rkm_medis}'
                            AND kd_poli = '${this.reg.kd_poli}'`)
                        .then(res => {
                            res[0].jml_periksa_poli > 0 ? status_poli = 'Lama' : status_poli = 'Baru'
                        }, err => {
                            return db.closeDb().then(() => {
                                this.is_loading = false
                                alert('Gagal simpan data registrasi, ' + err) 
                                throw err 
                            })
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal simpan data registrasi, ' + err) 
                            console.error(err)
                        })

                    db.doQuery(`INSERT INTO
                            reg_periksa
                            (no_reg, no_rawat, tgl_registrasi, jam_reg, kd_dokter, no_rkm_medis, kd_poli,
                                p_jawab, almt_pj, hubunganpj, biaya_reg, stts, stts_daftar, status_lanjut,
                                kd_pj, umurdaftar, sttsumur, status_bayar, status_poli)
                        VALUES
                            ('${this.reg.no_reg}', '${this.reg.no_rawat}', '${this.reg.tgl_registrasi}',
                                '${this.reg.jam_reg}', '${this.reg.kd_dokter}', '${this.pasien.no_rkm_medis}',
                                '${this.reg.kd_poli}', '${this.pasien.namakeluarga}', '${this.pasien.alamatpj}',
                                '${this.pasien.keluarga}', ${biaya}, 'Belum', '${this.pasien.status}', 'Ralan',
                                '${this.reg.kd_pj}', ${umur}, '${statusumur}', 'Belum Bayar', '${status_poli}')`)
                        .then(() => {
                            return db.doQuery(`UPDATE pasien
                                SET umur = CONCAT(
                                    CONCAT(
                                        CONCAT(TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()), ' Th '),
                                        CONCAT(TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                                            - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) div 12) * 12), ' Bl ')),
                                        CONCAT(TIMESTAMPDIFF(DAY, DATE_ADD(
                                            DATE_ADD(tgl_lahir,INTERVAL TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) YEAR), 
                                            INTERVAL TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) 
                                                - ((TIMESTAMPDIFF(MONTH, tgl_lahir, CURDATE()) div 12) * 12) MONTH), CURDATE()), ' Hr'))
                                WHERE
                                    no_rkm_medis = ${this.pasien.no_rkm_medis}`)
                        })
                        .then(() => {
                            alert("Berhasil Simpan Registrasi")
                            this.kosongkan()
                            this.getList()
                            this.is_loading = false

                            return db.closeDb()
                        }, err => {
                            return db.closeDb().then(() => { 
                                this.is_loading = false
                                alert('Gagal simpan data registrasi, ' + err) 
                                throw err 
                            })
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal simpan data registrasi, ' + err) 
                            console.error(err)
                        })
                } else {
                    const this_ = this
                    const reg_ = this_.reg
                    const pasien_ = this_.pasien

                    function updateReg () {
                        db.doQuery(`UPDATE reg_periksa
                            SET
                                no_reg = '${reg_.no_reg}',
                                tgl_registrasi = '${reg_.tgl_registrasi}',
                                jam_reg = '${reg_.jam_reg}',
                                kd_dokter = '${reg_.kd_dokter}',
                                no_rkm_medis = '${pasien_.no_rkm_medis}',
                                kd_poli = '${reg_.kd_poli}',
                                p_jawab = '${pasien_.namakeluarga}',
                                almt_pj = '${pasien_.alamatpj}',
                                biaya_reg = ${biaya},
                                hubunganpj = '${pasien_.keluarga}',
                                stts_daftar = '${pasien_.status}',
                                kd_pj = '${reg_.kd_pj}',
                                umurdaftar = '${umur}',
                                sttsumur = '${statusumur}'
                            WHERE
                                no_rawat = '${reg_.no_rawat}'`)
                            .then(() => {
                                alert("Berhasil Ubah Registrasi")
                                this_.kosongkan()
                                this_.getList()
                                this_.is_loading = false
    
                                return db.closeDb()
                            }, err => {
                                return db.closeDb().then(() => { 
                                    this_.is_loading = false
                                    alert('Gagal ubah data registrasi, ' + err) 
                                    throw err 
                                })
                            })
                            .catch(err => {
                                this_.is_loading = false
                                alert('Gagal ubah data registrasi, ' + err) 
                                console.error(err)
                            })
                    }

                    const trx = [false, false, false, false, false]

                    await db.doQuery(`SELECT
                            COUNT(no_rawat) as trx
                        FROM
                            rawat_jl_dr
                        WHERE
                            no_rawat = '${this.reg.no_rawat}'`)
                        .then(res => {
                            if (res[0].trx > 0) { trx[0] = true }
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal ubah data registrasi, ' + err) 
                            console.error(err)
                        })

                    await db.doQuery(`SELECT
                            COUNT(no_rawat) as trx
                        FROM
                            rawat_jl_pr
                        WHERE
                            no_rawat = '${this.reg.no_rawat}'`)
                        .then(res => {
                            if (res[0].trx > 0) { trx[1] = true }
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal ubah data registrasi, ' + err) 
                            console.error(err)
                        })

                    await db.doQuery(`SELECT
                            COUNT(no_rawat) as trx
                        FROM
                            rawat_jl_drpr
                        WHERE
                            no_rawat = '${this.reg.no_rawat}'`)
                        .then(res => {
                            if (res[0].trx > 0) { trx[2] = true }
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal ubah data registrasi, ' + err) 
                            console.error(err)
                        })

                    await db.doQuery(`SELECT
                            COUNT(no_rawat) as trx
                        FROM
                            periksa_lab
                        WHERE
                            no_rawat = '${this.reg.no_rawat}'`)
                        .then(res => {
                            if (res[0].trx > 0) { trx[3] = true }
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal ubah data registrasi, ' + err) 
                            console.error(err)
                        })

                    await db.doQuery(`SELECT
                            COUNT(no_rawat) as trx
                        FROM
                            kamar_inap
                        WHERE
                            no_rawat = '${this.reg.no_rawat}'`)
                        .then(res => {
                            if (res[0].trx > 0) { trx[4] = true }
                        })
                        .catch(err => {
                            this.is_loading = false
                            alert('Gagal ubah data registrasi, ' + err) 
                            console.error(err)
                        })

                    const valid = trx.reduce((total, item) => { return total || item })

                    if (valid) {
                        alert('Tidak bisa menyimpan ubahan, pasien sudah ada transaksi sebelumnya')
                    } else {
                        updateReg()
                    }
                }
            }
        },
        genNoReg: async function () {
            const db = new dbUtil()
            let max_no_booking = 0
            let max_no_register = 0
            await db.doQuery(`SELECT 
                    IFNULL(MAX(CONVERT(no_reg,signed)),0) AS maxno
                FROM 
                    booking_registrasi 
                WHERE 
                    kd_poli='${this.reg.kd_poli ? this.reg.kd_poli : ''}' 
                    AND tanggal_periksa='${this.reg.tgl_registrasi ? this.reg.tgl_registrasi : ''}'`)
                .then(res => {
                    max_no_booking = res[0].maxno

                    return db.doQuery(`SELECT 
                            IFNULL(MAX(CONVERT(no_reg,signed)),0) AS maxno
                        FROM 
                            reg_periksa 
                        WHERE 
                            kd_poli='${this.reg.kd_poli ? this.reg.kd_poli : ''}' 
                            AND tgl_registrasi='${this.reg.tgl_registrasi ? this.reg.tgl_registrasi : ''}'`)
                })
                .then(res => {
                    max_no_register = res[0].maxno

                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
           
            if (max_no_booking >= max_no_register) {
                this.reg.no_reg = (max_no_booking + 1).toString().padStart(3, '0')
            } else {
                this.reg.no_reg = (max_no_register + 1).toString().padStart(3, '0')
            }
        },
        genNoRawat: function () {
            const db = new dbUtil()
            let max_no_rwt = 0
            const tgl_reg_fmt = moment(this.reg.tgl_registrasi).format('YYYY/MM/DD')
            db.doQuery(`SELECT 
                    IFNULL(MAX(CONVERT(RIGHT(no_rawat,6),signed)),0) AS maxnorwt 
                FROM 
                    reg_periksa 
                WHERE 
                    tgl_registrasi='${this.reg.tgl_registrasi ? this.reg.tgl_registrasi : ''}'`)
                .then(res => {
                    max_no_rwt = res[0].maxnorwt
                    this.reg.no_rawat = `${tgl_reg_fmt}/${(max_no_rwt + 1).toString().padStart(6, '0')}`
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        kosongkan: function () {
            this.pasien = {
                no_rkm_medis: null
            }
            this.reg = {
                tgl_registrasi: null,
                jam_reg: null,
                kd_pj: null,
                kd_poli: null,
                kd_dokter: null
            }
            this.defaultTgl()
            this.genNoReg()
            this.genNoRawat()
            this.is_edit = false
        },
        inap: async function (px) {
            const db = new dbUtil()
            let verif_bill = 0

            await db.doQuery(`SELECT 
                    COUNT(no_rawat) AS bill_count
                FROM 
                    billing 
                WHERE 
                    no_rawat = '${px.no_rawat}'`)
            .then(res => {
                verif_bill = res[0].bill_count
                return db.closeDb()
            }, err => {
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))

            if (px.stts === 'Batal') {
                alert('Pasien berstatus Batal Periksa')
            } else if (parseInt(verif_bill) > 0) {
                alert('Data billing terverifikasi')
            } else {
                this.selected_pasien = {
                    no_rm: px.no_rkm_medis,
                    no_rawat: px.no_rawat,
                    nama: px.nm_pasien
                }
                this.di_visible = true
            }
        },
        ubah: function (px) {
            const db = new dbUtil()

            this.pasien.no_rkm_medis =  px.no_rkm_medis
            this.pasien.nm_pasien = px.nm_pasien
            this.pasien.status = px.stts_daftar
            this.pasien.tgl_lahir = px.tgl_lahir

            this.reg.no_reg = px.no_reg
            this.reg.no_rawat = px.no_rawat
            this.reg.tgl_registrasi = px.tgl_registrasi
            this.reg.kd_poli = px.kd_poli

            db.doQuery(`SELECT 
                    bb.kd_dokter, cc.no_ktp, 
                    CONCAT(alamat, ', ', ee.nm_kel) AS alamat_,
                    ff.nm_kec, gg.nm_kab, namakeluarga, keluarga, alamatpj,
                    no_peserta, cc.kd_pj, 
                    TIMESTAMPDIFF(YEAR, cc.tgl_lahir, CURDATE()) AS tahun,
                    (TIMESTAMPDIFF(MONTH, cc.tgl_lahir, CURDATE()) 
                        - ((TIMESTAMPDIFF(MONTH, cc.tgl_lahir, CURDATE()) DIV 12) * 12)) AS bulan,
                    TIMESTAMPDIFF(DAY, DATE_ADD(
                        DATE_ADD(cc.tgl_lahir, INTERVAL TIMESTAMPDIFF(YEAR, cc.tgl_lahir, CURDATE()) YEAR),
                        INTERVAL TIMESTAMPDIFF(MONTH, cc.tgl_lahir, CURDATE()) 
                            - ((TIMESTAMPDIFF(MONTH, cc.tgl_lahir, CURDATE()) DIV 12) * 12) MONTH),
                        CURDATE()) AS hari
                FROM
                    reg_periksa aa
                    LEFT JOIN dokter bb ON aa.kd_dokter = bb.kd_dokter
                    LEFT JOIN pasien cc ON aa.no_rkm_medis = cc.no_rkm_medis
                    LEFT JOIN poliklinik dd ON aa.kd_poli = dd.kd_poli                 
                    LEFT JOIN kelurahan ee ON cc.kd_kel = ee.kd_kel
                    LEFT JOIN kecamatan ff ON cc.kd_kec = ff.kd_kec
                    LEFT JOIN kabupaten gg ON cc.kd_kab = gg.kd_kab
                WHERE
                    no_rawat = '${px.no_rawat}'`)
                .then(res => {
                    this.pasien.no_ktp = res[0].no_ktp
                    this.pasien.alamat_ = res[0].alamat_
                    this.pasien.nm_kec = res[0].nm_kec
                    this.pasien.nm_kab = res[0].nm_kab
                    this.pasien.no_peserta = res[0].no_peserta
                    this.pasien.tahun = res[0].tahun
                    this.pasien.bulan = res[0].bulan
                    this.pasien.hari = res[0].hari
                    this.pasien.keluarga = res[0].keluarga
                    this.pasien.namakeluarga = res[0].namakeluarga
                    this.pasien.alamatpj = res[0].alamatpj

                    this.reg.kd_pj = res[0].kd_pj
                    this.reg.kd_dokter = res[0].kd_dokter

                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { 
                        alert('Gagal ambil data pasien, ' + err)
                        throw err 
                    })
                })
                .catch(err => {
                    alert('Gagal ambil data pasien, ' + err)
                    console.error(err)
                })

            this.reg = px
            this.is_edit = true
        },
        setWindowTitle: function () {
            const name = require('./package.json').name
            remote.getCurrentWindow().setTitle(`${name} | Registrasi Rawat Jalan`)
        },
        cetakKartu: function () {
            ipcRenderer.send('print', {
                type: 'card',
                data: {
                    no_rm: this.pasien.no_rkm_medis,
                    nama: this.pasien.nm_pasien,
                    alamat: this.pasien.alamat_,
                    tgl_lahir: moment(this.pasien.tgl_lahir).locale('id').format('D MMM YYYY'),
                    jk: this.pasien.jk,
                    jaminan: this.pasien.png_jawab,
                    tgl_reg: moment(this.pasien.tgl_daftar).locale('id').format('DD/MM/YY')
                }
            })
        },
        initContextMenu: function () {
            contextMenu({
                prepend: (_defaultAction, params, _browserWindow) => [
                    {
                        label: 'BOOMJAH' + params.titleText,
                        visible: params.titleText === 'data-pasien'
                    }
                ]
            })
        }
    }
}

export { Reg }