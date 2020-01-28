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
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="nama">
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="form-group">
                                    <label>Alamat</label>
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="alamat">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-sm btn-primary" @click="getData">Cari</button>
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
                                    <tr v-for="pasien in pasiens" :key="pasien.no_rkm_medis">
                                        <td>{{pasien.no_rkm_medis}}</td>
                                        <td>{{pasien.nm_pasien}}</td>
                                        <td>{{pasien.jk}}</td>
                                        <td>{{pasien.tgl_lahir}}</td>
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
            pasiens: []
        }
    },
    mounted: function () {
        this.getData()
    },
    methods: {
        getData: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    no_rkm_medis,
                    nm_pasien,
                    jk,
                    tgl_lahir,
                    alamat
                FROM
                    pasien
                ${this.nama || this.alamat ? 'WHERE ' : ''}
                    ${this.nama ? 'nm_pasien LIKE "%' + this.nama + '%" ' : ''}
                    ${this.alamat 
                        ? this.nama 
                            ? 'AND alamat LIKE "%' + this.alamat + '%" ' 
                            : 'alamat LIKE "%' + this.alamat + '%" '
                        : ''}
                ORDER BY
                    tgl_daftar DESC
                LIMIT 10`)
            .then(res => {
                this.pasiens = res
                return db.closeDb()
            }, err => {
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))
        }
    }
}

export { CariPasienD }