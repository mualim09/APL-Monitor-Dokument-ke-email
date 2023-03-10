import React, { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import { Head, Link } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import ModalFilter from './ModalFilter'
import ModalShare from './ModalShare'
import DocStatusItem from './DocStatusItem'
import { IconFilter, IconMenu } from '@/Icons'
import { formatDate } from '@/utils'

export default function Document(props) {
    const { types, departments } = props
    const { data: docs, links } = props.docs

    const [search, setSearch] = useState({q: ''})
    const preValue = usePrevious(search)

    const confirmModal = useModalState(false)
    const handleDelete = (doc) => {
        confirmModal.setData(doc)
        confirmModal.toggle()
    }

    const onDelete = () => {
        const doc = confirmModal.data
        if(doc != null) {
            Inertia.delete(route('docs.destroy', doc), {
                onSuccess: () => toast.success('The Data has been deleted'),
            })
        }
    }

    const filterModal = useModalState(false)
    const handleFilter = (filter) => {
        setSearch({
            ...search,
            ...filter,
        })
    }

    const shareModal = useModalState(false)
    const handleShare = (doc) => {
        shareModal.setData(doc)
        shareModal.toggle()
    }

    const sort = (key) => {
        setSearch({
            ...search,
            sortBy: key,
            sortRule: search.sortRule == 'asc' ? 'desc' : 'asc'
        })
    }

    useEffect(() => {
        if (preValue) {
            Inertia.get(
                route(route().current()),
                search,
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            notify={props.notify}
        >
            <Head title="Document" />
            <div className="flex flex-col w-full sm:px-6 lg:px-8 space-y-2">
                <div className="card bg-base-100 w-full">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row w-full mb-4 justify-between space-y-1 md:space-y-0">
                            <Link
                                className="btn btn-neutral"
                                href={route('docs.create')}
                            >
                                Tambah
                            </Link>
                            <div className='flex flex-row'>
                                <div className="form-control w-full">
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={search.q}
                                        onChange={(e) =>
                                            handleFilter({q: e.target.value})
                                        }
                                        placeholder="Search"
                                    />
                                </div>
                                <div className='tooltip'  data-tip="filter status etc">
                                    <div className='btn btn-outline' onClick={() => filterModal.toggle()}>
                                        <IconFilter/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto pb-44">
                            <table className="table w-full table-zebra">
                                <thead>
                                    <tr>
                                        <th className='hover:underline' onClick={() => sort('type_doc_id')}>Jenis</th>
                                        <th>Nama Dokumen</th>
                                        <th>Nama PIC</th>
                                        <th className='hover:underline' onClick={() => sort('end_date')}>Tanggal Berakhir</th>
                                        <th className='hover:underline' onClick={() => sort('status')}>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs?.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>{doc.type.name}</td>
                                            <td>{doc.name}</td>
                                            <td>{doc.pic_name}</td>
                                            <td>{formatDate(doc.end_date)}</td>
                                            <td><DocStatusItem status={doc.status}/></td>
                                            <td className='text-right'>
                                                <div className="dropdown dropdown-left">
                                                    <label tabIndex={0} className="btn btn-sm m-1 px-1"><IconMenu/></label>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li>
                                                            <Link href={route('docs.show', doc)}>Detail</Link>
                                                        </li>
                                                        <li onClick={() => handleShare(doc)}>
                                                            <div>Share</div>
                                                        </li>
                                                        <li>
                                                            <Link href={route('docs.edit', doc)}>Edit</Link>
                                                        </li>
                                                        <li onClick={() => handleDelete(doc)} className="bg-error ">
                                                            <div>Delete</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={links} params={search}/>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
            <ModalFilter
                isOpen={filterModal.isOpen}
                toggle={filterModal.toggle}
                filter={search}
                types={types}
                departments={departments}
                handleSetFilter={handleFilter}
            />
            <ModalShare
                isOpen={shareModal.isOpen}
                toggle={shareModal.toggle}
                modalState={shareModal}
            />
        </AuthenticatedLayout>
    )
}