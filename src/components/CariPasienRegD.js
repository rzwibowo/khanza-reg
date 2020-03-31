import { dbUtil } from '../dbconn.js'

const CariPasienRegD = {
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal1">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cari Pasien</h5>
                        <button type="button" class="close" data-dismiss="modal" @click="$emit('close')" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row align-items-end">
                            <div class="col-md-3">
                                <input type="date" class="form-control form-control-sm" 
                                    v-model="tgl_awal" @change="getList">
                            </div>
                            <div class="col-md-3">
                                <input type="date" class="form-control form-control-sm"
                                    v-model="tgl_akhir" @change="getList">
                            </div>
                            <div class="col-md-3">
                                <select class="form-control form-control-sm" 
                                    v-model="klinik_cari" @change="filterPasien">
                                    <option value="-">SEMUA</option>
                                    <option v-for="pk in polikliniks" :key="pk.kd_poli"
                                        :value="pk.kd_poli">
                                        {{ pk.nm_poli }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-3">
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
                        <div class="table-responsive" style="max-height: 80vh">
                            <table class="table table-hover table-striped table-sm">
                                <thead>
                                    <tr>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(pasien, idx) in pasiens_f" :key="pasien.no_rkm_medis" 
                                        @click="row_select = idx" @dblclick="selectPx(pasien.no_rkm_medis)" 
                                        :class="{selected: row_select === idx}">
                                        <td>
                                            <a href="#" @click="selectPx(pasien.no_rkm_medis)">
                                                {{ pasien.no_rkm_medis }}
                                            </a>
                                        </td>
                                        <td style="white-space: nowrap">{{ moment(pasien.tgl_registrasi).format('DD-MM-YYYY') }}</td>
                                        <td>{{ pasien.jam_reg }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_pasien }}</td>
                                        <td>{{ pasien.umur }}</td>
                                        <td style="white-space: nowrap">{{ moment(pasien.tgl_lahir).format('DD-MM-YYYY') }}</td>
                                        <td>{{ pasien.jk }}</td>
                                        <td style="white-space: nowrap">{{ pasien.alamat }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_dokter }}</td>
                                        <td style="white-space: nowrap">{{ pasien.nm_poli }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            cari: '',
            tgl_awal: '',
            tgl_akhir: '',
            klinik_cari: '-',
            pasiens: [],
            pasiens_f: [],
            polikliniks: [],
            row_select: null
        }
    },
    created: function () {
        this.defaultTglList()
        this.getListPoliklinik()
        this.getList()
    },
    methods: {
        defaultTglList: function () {
            this.tgl_awal = this.tgl_akhir = moment().format('YYYY-MM-DD')
        },
        getList: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    aa.tgl_registrasi, aa.jam_reg, no_rawat,
                    bb.nm_dokter, cc.no_rkm_medis, cc.nm_pasien, cc.jk,
                    cc.alamat, cc.tgl_lahir, 
                    CONCAT(aa.umurdaftar, ' ', aa.sttsumur) AS umur,
                    aa.kd_poli, dd.nm_poli, aa.stts
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
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))
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
        selectPx: function (noRm) {
            this.$emit('select-p', noRm)
            this.$emit('close')
        }
    }
}

export { CariPasienRegD }