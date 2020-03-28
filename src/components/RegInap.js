require('dotenv').config()
const remote = require('electron').remote

import { RegInapD } from './RegInapD.js'

import { dbUtil } from '../dbconn.js'

const RegInap = {
    template: `
        <div class="container-fluid p-0">
            <div class="row m-0">
                <div class="col-md-12">
                    <div class="table-responsive" class="h90vh">
                        <table class="table table-sm table-hover table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>No. Rawat</th>
                                    <th>No. RM</th>
                                    <th>Nama</th>
                                    <th>JK</th>
                                    <th>Umur</th>
                                    <th>Alamat</th>
                                    <th>Penanggung Jawab</th>
                                    <th>Hubungan PJ</th>
                                    <th>Jenis Bayar</th>
                                    <th>Kamar</th>
                                    <th>Tarif Kamar</th>
                                    <th>Diagnosa Awal</th>
                                    <th>Diagnosa Akhir</th>
                                    <th>Tgl Masuk</th>
                                    <th>Jam Masuk</th>
                                    <th>Tgl Keluar</th>
                                    <th>Jam Keluar</th>
                                    <th>Total Biaya</th>
                                    <th>Status Pulang</th>
                                    <th>Lama Inap</th>
                                    <th>Dokter PJ</th>
                                    <th>Status Bayar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(pasien, idx) in pasiens" :key="pasien.no_rawat">
                                    <tr @click="row_select = idx" :class="{selected: row_select === idx}">
                                        <td>
                                            <button class="btn btn-secondary btn-sm btn-action" 
                                                @click="act_visible === idx ? act_visible = null : act_visible = idx">
                                                <span v-show="act_visible !== idx">▼</span>
                                                <span v-show="act_visible === idx">▲</span>
                                            </button>
                                        </td>
                                        <td>{{ pasien.no_rawat }}</td>
                                        <td>{{ pasien.no_rkm_medis }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_pasien }}</td>
                                        <td>{{ pasien.jk }}</td>
                                        <td>{{ pasien.umur }}</td>
                                        <td>{{ pasien.alamat }}</td>
                                        <td>{{ pasien.p_jawab }}</td>
                                        <td>{{ pasien.hubunganpj }}</td>
                                        <td>{{ pasien.png_jawab }}</td>
                                        <td>{{ pasien.kamar }}</td>
                                        <td>{{ pasien.trf_kamar }}</td>
                                        <td>{{ pasien.diagnosa_awal }}</td>
                                        <td>{{ pasien.diagnosa_akhir }}</td>
                                        <td>{{ pasien.tgl_masuk }}</td>
                                        <td>{{ pasien.jam_masuk }}</td>
                                        <td>{{ pasien.tgl_keluar }}</td>
                                        <td>{{ pasien.jam_keluar }}</td>
                                        <td>{{ pasien.ttl_biaya }}</td>
                                        <td>{{ pasien.stts_pulang }}</td>
                                        <td>{{ pasien.lama }}</td>
                                        <td>{{ pasien.nm_dokter }}</td>
                                        <td>{{ pasien.status_bayar }}</td>
                                    </tr>
                                    <tr v-show="act_visible === idx">
                                        <td colspan="24">
                                            <button type="button" class="btn btn-link btn-sm">
                                                Opsi
                                            </button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <label>Total Pasien: {{pasiens.length}}</label>
                </div>
            </div>
            <RegInapD v-show="di_visible"></RegInapD>
         </div>
    `,
    components: {
        RegInapD
    },
    data: function () {
        return {
            tgl_awal: '',
            tgl_akhir: '',
            pasiens: [],
            di_visible: false,
            act_visible: null,
            row_select: null
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.defaultTglList()
        this.getList()
    },
    methods: {
        defaultTglList: function () {
            this.tgl_awal = this.tgl_akhir = moment().format('YYYY-MM-DD')
        },
        //#region Olah Data Pasien
        getList: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    aa.no_rawat, bb.no_rkm_medis, cc.nm_pasien, cc.jk,
                    CONCAT(cc.alamat, ', ', ff.nm_kel, ', ', gg.nm_kec, ', ', hh.nm_kab) AS alamat,
                    bb.p_jawab, bb.hubunganpj, jj.png_jawab,
                    CONCAT(aa.kd_kamar, ' ', ee.nm_bangsal) AS kamar,
                    aa.trf_kamar, aa.diagnosa_awal,	aa.diagnosa_akhir,
                    aa.tgl_masuk, aa.jam_masuk, 
                    IF(aa.tgl_keluar = '0000-00-00', '', aa.tgl_keluar) AS tgl_keluar,
                    IF(aa.jam_keluar = '00:00:00', '', aa.jam_keluar) AS jam_keluar,
                    aa.ttl_biaya, aa.stts_pulang, aa.lama, ii.nm_dokter,
                    aa.kd_kamar, bb.kd_pj,
                    CONCAT(bb.umurdaftar, ' ', bb.sttsumur) AS umur,
                    bb.status_bayar
                FROM
                    kamar_inap aa
                LEFT JOIN reg_periksa bb ON aa.no_rawat = bb.no_rawat
                LEFT JOIN pasien cc ON bb.no_rkm_medis = cc.no_rkm_medis
                LEFT JOIN kamar dd ON aa.kd_kamar = dd.kd_kamar
                LEFT JOIN bangsal ee ON dd.kd_bangsal = ee.kd_bangsal
                LEFT JOIN kelurahan ff ON cc.kd_kel = ff.kd_kel
                LEFT JOIN kecamatan gg on cc.kd_kec = gg.kd_kec
                LEFT JOIN kabupaten hh on cc.kd_kab = hh.kd_kab
                LEFT JOIN dokter ii ON bb.kd_dokter = ii.kd_dokter
                LEFT JOIN penjab jj ON bb.kd_pj = jj.kd_pj
                ORDER BY
                    ee.nm_bangsal,
                    aa.tgl_masuk,
                    aa.jam_masuk`)
                .then(res => {
                    this.pasiens = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        setWindowTitle: function () {
            const name = require('./package.json').name
            remote.getCurrentWindow().setTitle(`${name} | Data Rawat Inap`)
        }
    }
}

export { RegInap }