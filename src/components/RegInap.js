require('dotenv').config()
const remote = require('electron').remote

import { RegInapD } from './RegInapD.js'

import { dbUtil } from '../dbconn.js'

const RegInap = {
    template: `
        <div class="container-fluid p-0">
            <div class="row m-0">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-2">
                            <select class="form-control form-control-sm"
                                v-model="status_pulang" @change="getList">
                                <option value="0">Belum Pulang</option>
                                <option value="1">Masuk</option>
                                <option value="2">Pulang</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <input type="date" class="form-control form-control-sm"
                                v-model="tgl_awal" :disabled="status_pulang === '0'"
                                @change="getList">
                        </div>
                        <div class="col-md-2">
                            <input type="date" class="form-control form-control-sm"
                                v-model="tgl_akhir" :disabled="status_pulang === '0'"
                                @change="getList">
                        </div>
                        <div class="col-md-2">
                            <select class="form-control form-control-sm"
                                v-model="status_bayar" @change="getList">
                                <option value="-">Semua</option>
                                <option value="Sudah Bayar">Sudah Bayar</option>
                                <option value="Belum Bayar">Belum Bayar</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-control form-control-sm"
                                v-model="kamar_cari" @change="filterPasien">
                                <option value="-">Semua</option>
                                <option v-for="(kamar, idx) in kamars" :key="idx" 
                                    :value="kamar.kd_bangsal">{{ kamar.nm_bangsal }}</option>
                            </select>
                        </div>
                        <div class="col-md-2">
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
                                <template v-for="(pasien, idx) in pasiens_f" :key="pasien.no_rawat">
                                    <tr @click="row_select = idx" :class="{selected: row_select === idx}">
                                        <td>
                                            <button class="btn btn-secondary btn-sm btn-action" 
                                                @click="act_visible === idx ? act_visible = null : act_visible = idx"
                                                v-if="pasien.no_rawat">
                                                <span v-show="act_visible !== idx">▼</span>
                                                <span v-show="act_visible === idx">▲</span>
                                            </button>
                                        </td>
                                        <td>{{ pasien.no_rawat }}</td>
                                        <td>{{ pasien.no_rkm_medis }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_pasien }}</td>
                                        <td>{{ pasien.jk }}</td>
                                        <td>{{ pasien.umur }}</td>
                                        <td style="white-space: nowrap">{{ pasien.alamat }}</td>
                                        <td style="white-space: nowrap">{{ pasien.p_jawab }}</td>
                                        <td>{{ pasien.hubunganpj }}</td>
                                        <td style="white-space: nowrap">{{ pasien.png_jawab }}</td>
                                        <td style="white-space: nowrap">{{ pasien.kamar }}</td>
                                        <td>{{ pasien.trf_kamar }}</td>
                                        <td>{{ pasien.diagnosa_awal }}</td>
                                        <td>{{ pasien.diagnosa_akhir }}</td>
                                        <td style="white-space: nowrap">{{ pasien.tgl_masuk }}</td>
                                        <td style="white-space: nowrap">{{ pasien.jam_masuk }}</td>
                                        <td style="white-space: nowrap">{{ pasien.tgl_keluar }}</td>
                                        <td style="white-space: nowrap">{{ pasien.jam_keluar }}</td>
                                        <td>{{ pasien.ttl_biaya }}</td>
                                        <td style="white-space: nowrap">{{ pasien.stts_pulang }}</td>
                                        <td>{{ pasien.lama }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_dokter }}</td>
                                        <td style="white-space: nowrap">{{ pasien.status_bayar }}</td>
                                    </tr>
                                    <tr v-show="act_visible === idx && pasien.no_rawat">
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
                    <div class="row">
                        <div class="col-md-1">
                            <label>Total Pasien: {{pasiens_f.length}}</label>
                        </div>
                        <div class="col-md-11">
                            <button class="btn btn-primary btn-sm" 
                                @click="di_visible = !di_visible">
                                Masuk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <RegInapD v-show="di_visible" @close="di_visible = false"
                :searchable="true"></RegInapD>
         </div>
    `,
    components: {
        RegInapD
    },
    data: function () {
        return {
            pasiens: [],
            pasiens_f: [],
            tgl_awal: '',
            tgl_akhir: '',
            kamars: [],
            kamar_cari: '-',
            status_pulang: '0',
            status_bayar: '-',
            cari: '',
            di_visible: false,
            act_visible: null,
            row_select: null
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.defaultTglList()
        this.getListKamar()
        this.getList()
    },
    methods: {
        defaultTglList: function () {
            this.tgl_awal = this.tgl_akhir = moment().format('YYYY-MM-DD')
        },
        getList: function () {
            const db = new dbUtil()

            let search_param = ''
            switch (this.status_pulang) {
                case '0':
                    search_param = `stts_pulang = '-' 
                        AND bb.status_bayar LIKE '%${this.status_bayar === '-' ? '' : this.status_bayar}%'`
                    break
                case '1':
                    search_param = `aa.tgl_masuk BETWEEN '${this.tgl_awal}' AND '${this.tgl_akhir}'
                        AND bb.status_bayar LIKE '%${this.status_bayar === '-' ? '' : this.status_bayar}%'`
                    break
                case '2':
                    search_param = `aa.tgl_keluar BETWEEN '${this.tgl_awal}' AND '${this.tgl_akhir}' 
                        AND bb.status_bayar LIKE '%${this.status_bayar === '-' ? '' : this.status_bayar}%'`
                    break
                default:
                    search_param = ''
                    break
            }

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
                    aa.kd_kamar, bb.kd_pj, ee.kd_bangsal,
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
                WHERE
                    ${search_param}
                ORDER BY
                    ee.nm_bangsal,
                    aa.tgl_masuk,
                    aa.jam_masuk`)
            .then(res => {
                this.pasiens = res
                const rwt_px_anak = this.pasiens.length > 0
                    ? this.pasiens
                        .map(item => { return `'${item.no_rawat}'` })
                        .join()
                    : ''

                    return db.doQuery(`SELECT
                        bb.no_rkm_medis, bb.nm_pasien, cc.no_rawat, cc.no_rawat2,
                        CONCAT(aa.umurdaftar, ' ', aa.sttsumur) AS umur,
                        bb.no_peserta, bb.jk,
                        CONCAT(bb.alamatpj, ', ', bb.kelurahanpj, ', ', bb.kecamatanpj, ', ', bb.kabupatenpj) AS alamat
                    FROM
                        reg_periksa aa
                        LEFT JOIN pasien bb ON bb.no_rkm_medis = aa.no_rkm_medis
                        LEFT JOIN ranap_gabung cc ON cc.no_rawat2 = aa.no_rawat
                    WHERE
                        cc.no_rawat IN (${rwt_px_anak})`)
            })
            .then(res => {
                const px_anak = res
                if (px_anak.length > 0) {
                    px_anak.map(item => {
                        const data_ibu = this.pasiens.filter(item_ => { 
                            return item_.no_rawat === item.no_rawat 
                        })[0]
                        const data = {
                            no_rawat: '',
                            no_rkm_medis: item.no_rkm_medis,
                            nm_pasien: item.nm_pasien,
                            jk: item.jk,
                            umur: item.umur,
                            alamat: item.alamat,
                            p_jawab: data_ibu.p_jawab,
                            hubunganpj: data_ibu.hubunganpj,
                            png_jawab: data_ibu.png_jawab,
                            kamar: data_ibu.kamar,
                            trf_kamar: 0,
                            diagnosa_awal: '',
                            diagnosa_akhir: '',
                            tgl_masuk: data_ibu.tgl_masuk,
                            jam_masuk: data_ibu.jam_masuk,
                            tgl_keluar: data_ibu.tgl_keluar,
                            jam_keluar: data_ibu.jam_keluar,
                            ttl_biaya: 0,
                            stts_pulang: data_ibu.stts_pulang,
                            lama: data_ibu.lama,
                            nm_dokter: data_ibu.nm_dokter,
                            status_bayar: data_ibu.status_bayar,
                            kd_kamar: data_ibu.kd_kamar,
                            kd_bangsal: data_ibu.kd_bangsal
                        }
                        const index_ibu = this.pasiens.indexOf(data_ibu)
                        this.pasiens.splice(index_ibu + 1, 0, data)
                    })
                }
                
                this.filterPasien()
                return db.closeDb()
            }, err => {
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))
        },
        filterPasien: function () {
            this.pasiens_f = this.pasiens
            if (this.kamar_cari !== '-')  {
                this.pasiens_f = this.pasiens_f.filter(item => {
                    return item.kd_bangsal === this.kamar_cari
                })
            }
            if (this.cari) {
                const keyword = this.cari.trim().toLowerCase()
                this.pasiens_f = this.pasiens_f.filter(item => {
                    return item.no_rawat.trim().toLowerCase().includes(keyword)
                    || item.no_rkm_medis.trim().toLowerCase().includes(keyword)
                    || item.nm_pasien.trim().toLowerCase().includes(keyword)
                    || item.alamat.trim().toLowerCase().includes(keyword)
                    || item.diagnosa_awal.trim().toLowerCase().includes(keyword)
                    || item.diagnosa_akhir.trim().toLowerCase().includes(keyword)
                    || item.nm_dokter.trim().toLowerCase().includes(keyword)
                    || item.png_jawab.trim().toLowerCase().includes(keyword)
                })
            }
        },
        getListKamar: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    bb.kd_bangsal, aa.nm_bangsal
                FROM 
                    bangsal aa
                    JOIN kamar bb ON bb.kd_bangsal = aa.kd_bangsal
                WHERE
                    bb.statusdata = '1'
                GROUP BY
                    kd_bangsal
                ORDER BY 
                    aa.nm_bangsal`)
            .then(res => {
                this.kamars = res
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