import { dbUtil } from '../dbconn.js'

const CariKamarD = {
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal1">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cari Kamar</h5>
                        <button type="button" class="close" data-dismiss="modal" @click="$emit('close')" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row align-items-end">
                            <div class="col-md-5">
                                <div class="form-group">
                                    <input type="search" class="form-control form-control-sm"
                                        v-model="cari" @input="if (cari.length >= 3 || cari.length === 0) { getData() }">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-sm btn-primary" @click="getData">Cari</button>
                            </div>
                        </div>
                        <div class="table-responsive" style="max-height: 70vh">
                            <table class="table table-hover table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>No. Bed</th>
                                        <th>Kode Kamar</th>
                                        <th>Nama Kamar</th>
                                        <th>Kelas</th>
                                        <th>Tarif</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(kamar, idx) in kamars" :key="kamar.kd_kamar" 
                                        @click="row_select = idx" 
                                        @dblclick="selectKmr(kamar)" 
                                        :class="{selected: row_select === idx}">
                                        <td>
                                            <a href="#" @click="selectKmr(kamar)">
                                                {{kamar.kd_kamar}}
                                            </a>
                                        </td>
                                        <td>{{kamar.kd_bangsal}}</td>
                                        <td>{{kamar.nm_bangsal}}</td>
                                        <td>{{kamar.kelas}}</td>
                                        <td>{{kamar.trf_kamar}}</td>
                                        <td>{{kamar.status}}</td>
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
            kamars: [],
            row_select: null
        }
    },
    created: function () {
        this.getData()
    },
    methods: {
        getData: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    bb.kd_kamar, bb.kd_bangsal, aa.nm_bangsal, 
                    bb.kelas, bb.trf_kamar, bb.status 
                FROM 
                    bangsal aa
                    JOIN kamar bb ON bb.kd_bangsal = aa.kd_bangsal
                WHERE
                    aa.nm_bangsal LIKE '%${this.cari ? this.cari : '' }%'
                    OR bb.status LIKE '%${this.cari ? this.cari : '' }%'
                    OR bb.kd_kamar LIKE '%${this.cari ? this.cari : '' }%'
                    OR bb.kd_bangsal LIKE '%${this.cari ? this.cari : '' }%'
                    OR bb.kelas LIKE '%${this.cari ? this.cari : '' }%'
                    OR bb.trf_kamar LIKE '%${this.cari ? this.cari : '' }%'
                    AND bb.statusdata = '1'
                ORDER BY 
                    aa.nm_bangsal`)
            .then(res => {
                this.row_select = null
                this.kamars = res
                return db.closeDb()
            }, err => {
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))
        },
        selectKmr: function (kamar) {
            this.$emit('select-k', kamar)
            this.$emit('close')
        }
    }
}

export { CariKamarD }