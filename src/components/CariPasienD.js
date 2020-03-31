import { dbUtil } from '../dbconn.js'

const CariPasienD = {
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
                            <div class="col-md-5">
                                <div class="form-group">
                                    <label>Nama</label>
                                    <input type="search" class="form-control form-control-sm"
                                        v-model="nama" @input="if (nama.length >= 3 || nama.length === 0) { getList() }">
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="form-group">
                                    <label>Alamat</label>
                                    <input type="search" class="form-control form-control-sm"
                                        v-model="alamat" @input="if (alamat.length >= 5 || alamat.length === 0) { getList() }">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-sm btn-primary" @click="getList">Cari</button>
                            </div>
                        </div>
                        <div class="table-responsive" style="max-height: 80vh">
                            <table class="table table-hover table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>No. RM</th>
                                        <th>Nama</th>
                                        <th>JK</th>
                                        <th>Tanggal Lahir</th>
                                        <th>Alamat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(pasien, idx) in pasiens" :key="pasien.no_rkm_medis" 
                                        @click="row_select = idx" @dblclick="selectPx(pasien.no_rkm_medis)" 
                                        :class="{selected: row_select === idx}">
                                        <td>
                                            <a href="#" @click="selectPx(pasien.no_rkm_medis)">
                                                {{pasien.no_rkm_medis}}
                                            </a>
                                        </td>
                                        <td>{{pasien.nm_pasien}}</td>
                                        <td>{{pasien.jk}}</td>
                                        <td>{{moment(pasien.tgl_lahir).format('DD-MM-YYYY')}}</td>
                                        <td>{{pasien.alamat}}</td>
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
            nama: '',
            alamat: '',
            pasiens: [],
            row_select: null
        }
    },
    created: function () {
        this.getList()
    },
    methods: {
        getList: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    no_rkm_medis, nm_pasien, jk, tgl_lahir, alamat
                FROM
                    pasien
                WHERE
                    nm_pasien LIKE '%${this.nama ? this.nama : '' }%'
                    AND alamat LIKE '%${this.alamat ? this.alamat :  ''}%'
                ORDER BY
                    tgl_daftar DESC
                LIMIT 10`)
            .then(res => {
                this.row_select = null
                this.pasiens = res
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

export { CariPasienD }