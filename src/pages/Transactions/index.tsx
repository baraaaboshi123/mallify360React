import _, { StringNullableChain } from "lodash";
import clsx from "clsx";
import * as XLSX from 'xlsx';
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


function Main() {
  const location = useLocation();
  const idFromPreviousPage = location.state?.data;
    function exportToExcel(data : Array<{
        user_name:string;
        amount:number;
        type:string;
        status:string;
        total_amount:number;
        store_id:number;
        store_name:string;
        created_at:string;
        user_address:string;
    }>, fileName : string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [transactions, setTransactions] = useState<Array<
  {
    id:number;
    user_name:string;
    amount:number;
    total_amount:number;
    type:string;
    status:string;
    store_id:number;
    store_name:string;
    created_at:string;
    user_address:string;
    
  }>>([])
  const [allTransactions, setAllTransactions] = useState<Array<
  {
    user_name:string;
    id:number;
    amount:number;
    total_amount:number;
    type:string;
    status:string;
    store_id:number;
    store_name:string;
    created_at:string;
    user_address:string;
    
  }>>([])
  const [storeName, setStoreName] = useState("")


  const fetchTransactions = async () =>{
    if(idFromPreviousPage>0){
      await axios
            .get(
                `http://localhost:8000/getTransactions/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAllTransactions(response.data);
                setCurrentPage(1); 
            });
    }
    else{
      await axios.get("http://localhost:8000/getTransactionWeb").then((response)=>{
      setAllTransactions(response.data)
      
      setCurrentPage(1); // Reset to first page on new data
    })
    }
    
  }

  useEffect(()=>{
    localStorage.setItem("page", "Transactions")
    fetchTransactions()
  },[])
  const deleteButtonRef = useRef(null);
  useEffect(() => {
    setTotal(allTransactions.length)
    let filtered = allTransactions;
    if (filter !== "all") {
        filtered = filtered.filter(transaction => transaction.status === filter);
    }
    if (storeName !== "") {
        filtered = filtered.filter(transaction => 
            transaction.store_name && transaction.store_name.toLowerCase().startsWith(storeName.toLowerCase())
        );}
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);
    setTransactions(paginatedTransactions);
}, [filter, storeName, currentPage, itemsPerPage, allTransactions]);

const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
const navigate = useNavigate()


  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Transaction List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="relative w-48 text-slate-500">
              <FormInput
                type="text"
                className="w-48 pr-10 !box"
                placeholder="Search by store name"
                value={storeName}
                onChange={(e)=>setStoreName(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="ml-2 !box"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Status</option>
              <option value="placed">placed</option>
              <option value="on delivery">on delivery</option>
              <option value="complete">complete</option>
            </FormSelect>
          </div>
          <div className="hidden mx-auto xl:block text-slate-500">
            Showing 1 to {itemsPerPage} of {total} entries
          </div>
          <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
            <Button variant="primary" className="mr-2 shadow-md" onClick={()=>exportToExcel(allTransactions,"transactions")}>
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
              Excel
            </Button>
            
            <Menu className="menu">
              <Menu.Button as={Button} className="px-2 !box">
                <span className="flex items-center justify-center w-5 h-5">
                  <Lucide icon="Plus" className="w-4 h-4" />
                </span>
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item onClick={()=>window.print()}>
                  <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                </Menu.Item>
                <Menu.Item onClick={()=>exportToExcel(allTransactions,"transactions")}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </Menu.Item>
                
              </Menu.Items>
            </Menu>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div id="transactions" className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                
                
                <Table.Th className="border-b-0 whitespace-nowrap">
                  BUYER NAME
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  PAYMENT
                </Table.Th>
                
                <Table.Th className="text-right border-b-0 whitespace-nowrap">
                  <div className="pr-16">TOTAL TRANSACTION</div>
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  STORE NAME
                </Table.Th>
                {/* <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transactions.map((faker, fakerKey) => (
                <Table.Tr key={fakerKey} className="intro-x">
                 
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a href="" className="font-medium whitespace-nowrap">
                      {faker.user_name}
                    </a>
                    
                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        {faker.user_address}
                      </div>
                    
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx({
                        "flex items-center justify-center whitespace-nowrap":
                          true,
                        "text-success": faker.status === "Complete" || faker.status === "complete"
                        
                      })}
                    >
                      {
                        faker.status === "Complete" || faker.status === "complete" ?
                        (
                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                        )
                        :
                        ""
                      }
                    
                      {faker.status }
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {faker.type === "paypal" ? (
                      <>
                        <div className="whitespace-nowrap">
                          Direct PayPal transfer
                        </div>
                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {faker.created_at}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-nowrap">
                          Cash On Delivery payments
                        </div>
                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {faker.created_at}
                        </div>
                      </>
                    )}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 text-right bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="pr-16">₪{idFromPreviousPage>0 ? faker.total_amount_for_store:  faker.total_amount}</div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 text-right bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="pr-16">{faker.store_name}</div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <a
                        className="flex cursor-pointer items-center mr-5 text-primary whitespace-nowrap"
                        onClick={()=>navigate("/transactionsDetails",{
                          state: { id: faker.id },
                      })}
                      >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                        View Details
                      </a>
                      
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                <Pagination className="w-full sm:w-auto sm:mr-auto">
                    <Pagination.Link onClick={(e) => 
                        {
                            e.preventDefault()
                            setCurrentPage(Math.max(1, currentPage - 1))
                        
                        }}>
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                    </Pagination.Link>
                    {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Link key={idx} active={idx + 1 === currentPage} onClick={(e) => 
                        {
                            // e.preventDefault()
                            setCurrentPage(idx + 1)}
                        }
                        >
                            {idx + 1}
                        </Pagination.Link>
                    ))}
                    <Pagination.Link onClick={(e) => 
                        {
                            e.preventDefault()
                             setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                       }>
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                    </Pagination.Link>
                </Pagination>
                <FormSelect className="w-20 mt-3 !box sm:mt-0" value={itemsPerPage.toString()} onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}>
                    <option>10</option>
                    <option>25</option>
                    <option>35</option>
                    <option>50</option>
                </FormSelect>
            </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
