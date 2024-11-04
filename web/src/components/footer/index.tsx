import React from 'react'
import './footer.css';

function Footer() {
    return (
        <div className="container-footer">
            <footer className="footer text-center text-lg-start text-white">
                <section className="links">
                    <div className="container text-center text-md-start mt-1">
                        <div className="row mt-5">
                            <div className="col-12">
                                <h6 className="text-uppercase fw-bold text-center">Contactos</h6>
                                <hr className="divider text-center" />
                                <div className="d-flex flex-column flex-md-row justify-content-center">
                                    <p className="mr-md-3 mb-2 mb-md-0">20220837@iade.pt</p>
                                    <p className="mr-md-3 mb-2 mb-md-0">20220907@iade.pt</p>
                                    <p className="mr-md-3 mb-2 mb-md-0">20220905@iade.pt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center p-3 text-black">
                    © 2024 Vyt
                </div>
            </footer>
        </div>
    );
}

export default Footer
