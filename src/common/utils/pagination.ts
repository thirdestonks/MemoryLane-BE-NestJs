export class Pagination {
    static setPage(page: number) {
        return (page == undefined || page <= 0) ? 1 : page;
    }

    static setItemPerPage(itemsPerPage: number) {
        return (itemsPerPage == undefined || itemsPerPage <= 0) ? 15 : itemsPerPage;
    }

    static skipItems(page: number, itemsPerPage: number) {
        return (this.setPage(page) - 1) * itemsPerPage;
    }

    static previousPage(page: number, data: Array<any>) {
        return (data.length === 0 || this.setPage(page) === 1) ? null : page - 1;
    }

    static nextPage(page: number, itemsPerPage: number, items: number, data: Array<any>) {
        return (data.length === 0 || this.setPage(page) === this.totalPage(itemsPerPage, items)) ? null : this.setPage(page) + 1;
    }

    static totalPage(itemsPerPage: number, items: number) {
        const total = Math.ceil(items / itemsPerPage);
        return total > 0 ? total : null;
    }
}