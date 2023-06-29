import React, { useState, useEffect } from 'react';
import { getImages } from "../api";
import { useQuery } from 'react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReactPaginate from 'react-paginate';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Modal from 'react-modal';
import "./Dashboard.css"
import thumbsUp from "../assets/icons8-thumbs-up-48.png";
import thumbsDown from "../assets/icons8-thumbs-down-64.png"
import Switch from "react-switch";
import Select from 'react-select';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "50rem",
    maxHeight: "50rem",
    zIndex: 2000,
    borderRadius: "0.438rem",
    background: '#2E3035'
  },
};
const options = [
  { value: '', label: 'Filter' },
  { value: 'hot', label: 'Hot' },
  { value: 'top', label: 'Top' },
  { value: 'user', label: 'User' },

];
const windowOptions = [
  { value: '', label: 'Select Window' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All' },

];
const sortOptions = [
  { value: '', label: 'Select Sort' },
  { value: 'viral', label: 'Viral' },
  { value: 'top', label: 'Top' },
  { value: 'time', label: 'Time' },
  { value: 'rising', label: 'Rising' },

];
export const Dashboard = () => {

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const items: any[] = [...Array(33).fill(23)];
  const itemsPerPage = 8
  const [page, setPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [imageList, setImageList] = useState<any>([])
  const [currentItems, setCurrentItems] = useState<any>(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<any>('hot')
  const [viralInclude, setViralInclude] = useState<boolean>(false);
  const [unFiltered,setUnfiltered]=useState<any>(null)
  const [selectedWindowFilter,setSelectedWindowFilter]=useState<any>('')
  const [selectedSortFilter,setSelectedSortFilter]=useState<any>('')
  const { data, isLoading, isFetching } = useQuery(['getRandom', page,selectedFilter == '' ? 'hot' :selectedFilter ,selectedSortFilter == '' ? 'viral' : selectedSortFilter,selectedWindowFilter == '' ? 'day' : selectedWindowFilter ], getImages, {
    enabled: true,
    refetchOnWindowFocus: false
  })

  const handlePageClick = (event: any) => {
    const newOffset = event.selected * itemsPerPage % items.length;

    setItemOffset(newOffset);
    setPage(prev => prev + 1);
  };
  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);
  const closeModal = () => {
    setSelectedImage(null);
  }
  const openModal = (image: any) => {
    setSelectedImage(image)

  }
  useEffect(() => {
    if (selectedImage) {
      setIsOpen(true);
    }
    else {
      setIsOpen(false)
    }
  }, [selectedImage])
  useEffect(() => {
    if (data) {
      let main = (data?.filter((element: any) => 'images' in element).map((image: any) =>  image.images.map((oneImage:any)=> ({link:oneImage?.link,description:oneImage?.description,score:image.score,ups:image.ups,downs:image.downs,title:image?.title,viral:image.in_most_viral})))).flat();
      setUnfiltered(main);
      if(viralInclude){
       let temp= main.filter((element:any) => element.viral == true);
       setImageList(temp);
      }else{
        setImageList([...main])
      }
     
    }

  }, [data])
  const getRandomColor = (): string | number => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color as string | number;
  }
  const handleSelectChange = (value: any) => {
   
    setSelectedFilter(value?.value ? value?.value : '')


  }
  useEffect(()=>{
   if(selectedFilter == "hot"){
    setViralInclude(true);
   }
  },[selectedFilter])
  const handleWindowChange = (value: any) => {
    setSelectedWindowFilter(value?.value ? value?.value : '')
  }
  const handleSortChange = (value: any) => {
    setSelectedSortFilter(value?.value ? value?.value : '')
  }
  

  const handleinCludeVirals = (value: boolean) => {
   
    setViralInclude(value);
  }

  useEffect(() => {

    if (unFiltered) {
    console.log(unFiltered)
      let main= [...unFiltered]
      let temp = main?.filter((element: any) => element.viral == viralInclude);
    
      setImageList(temp);
    }



  }, [viralInclude]);


  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem", padding: '5rem', overflowY: 'hidden', alignItems: "center" }}>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "white", fontSize: "1.2rem", fontWeight: "700" }}>Include Virals</span>
              <Switch onChange={handleinCludeVirals} checked={viralInclude} />
            </label>

          </div>
         


          <Select
            defaultInputValue={selectedFilter}
            onChange={handleSelectChange}
            styles={{ container: base => ({ ...base, flex: 1 }) }}
            className="basic-single"
            classNamePrefix="select"
            defaultValue={options[0]}
            isClearable={true}
            isSearchable={true}
            name="color"
            options={options}
          />
            <Select
            defaultInputValue={selectedWindowFilter}
            onChange={handleWindowChange}
            styles={{ container: base => ({ ...base, flex: 1 }) }}
            className="basic-single"
            classNamePrefix="select"
            isDisabled = {selectedFilter == 'top' ? false : true}
            defaultValue={windowOptions[0]}
            isClearable={true}
            isSearchable={true}
          
            name="window"
            options={windowOptions}
          />
            <Select
            defaultInputValue={selectedSortFilter}
            onChange={handleSortChange}
            styles={{ container: base => ({ ...base, flex: 1 }) }}
            className="basic-single"
            classNamePrefix="select"
            defaultValue={sortOptions[0]}
            isClearable={true}
            isSearchable={true}
            isDisabled = {selectedFilter == 'user' ? false : true}
            name="sort"
            options={sortOptions}
          />
        </div>



        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap", justifyContent: "center", overflowY: 'hidden' }}>

          {!isFetching ? imageList.map((image: any, index: number) =>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className='image-container' onClick={() => openModal(image)} style={{ cursor: 'pointer', background: getRandomColor(), flexGrow: 1, minHeight: "18.75rem", minWidth: "18.75rem", borderTopLeftRadius: '0.438rem', borderTopRightRadius: '0.438rem', borderBottomLeftRadius: image?.description ? '0px' : '0.438rem', borderBottomRightRadius: image?.description ? '0px' : '0.438rem' }}>
                <LazyLoadImage
                  effect="blur"
                  wrapperClassName='image'
                  key={index}
                  alt={image.alt}
                  height={300}
                  src={image.link}
                  width={300}
                />

                <div className="middle">
                  <div className="hovered-text">Click to see details</div>
                </div>
              </div>
              {image?.description && <div style={{ display: 'flex',flexWrap:"nowrap", padding: '7px', width: "300px", justifyContent: "center", flexGrow: 1, height: "auto", border: "2px solid #414958", borderTop: "0px solid white", borderBottomLeftRadius: "7px", borderBottomRightRadius: "7px" }}>

                <span style={{ color: "white",overflow:"overlay",overflowX:"hidden" }}>{image?.description?.length > 100 ? image?.description?.substring(0, 100) + '...' : image?.description}</span>

              </div>}
            </div>
          )



            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((image: any, index: number) =>

              <div style={{ minHeight: "18.75rem", minWidth: "18.75rem", borderRadius: '0.438' }}>
                <Skeleton width="100%" height="100%" />
              </div>
            )

          }

        </div>
        <div style={{ display: "flex", justifyContent: "center", zIndex: 0 }}>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={1000}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />

        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", gap: "1.5rem", margin: "1rem", color: "white", overflowX: 'hidden' }}>
          <div style={{ background: getRandomColor(), minWidth: "20rem", minHeight: "25rem", maxWidth: "20rem", maxHeight: "25rem", borderRadius: "0.438rem" }}>
            <img style={{ borderRadius: "0.438rem", width: "100%", height: '100%' }} src={selectedImage?.link} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{selectedImage?.title ? selectedImage?.title : 'No Title'}</span>
            <span>{selectedImage?.description}</span><hr />
            <div style={{ display: 'flex', alignItems: "center" }}>
              <span style={{ display: "flex", gap: "7px", justifyContent: "center", alignItems: "center", flexGrow: 1, color: '#4CAF50', fontSize: "1.5rem", fontWeight: 700 }}>{selectedImage?.ups ? selectedImage?.ups : 0}
                <img style={{ width: "30px", height: "30px" }} src={thumbsUp} />
              </span>
              <span style={{ display: "flex", gap: "7px", justifyContent: "center", alignItems: "center", flexGrow: 1, color: '#D62127', fontSize: "1.5rem", fontWeight: 700 }}>{selectedImage?.downs ? selectedImage?.downs : 0}
                <img style={{ width: "30px", height: "30px" }} src={thumbsDown} />
              </span>

              <div />
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>Score : {selectedImage?.score ? selectedImage?.score : 0}</span>
            </div>
          </div>

        </div>
      </Modal>
    </>
  );
};


