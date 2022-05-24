import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { NFTCard } from "./components/nftCard"
import ReactPaginate from 'react-paginate'

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const [pageNumber, setPageNumber] = useState(0)
  const [nftNum, setNftNum] = useState(0)


  const nftsPerPage = 15
  const nftsVisited = pageNumber * nftsPerPage
  const pageCount = Math.ceil(NFTs.length / nftsPerPage)

  const diplayNfts = NFTs.slice(nftsVisited, nftsVisited + nftsPerPage).map(nft => {
    return (<NFTCard key={nft.id.tokenId} nft={nft}></NFTCard>)
  })

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_API_KEY
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = process.env.NEXT_PUBLIC_API_KEY
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&startToken=${nftNum}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts.nfts)
        console.log("Next Token", nfts.nextToken)
        setNFTs(oldState =>[...oldState,...nfts.nfts])
      }
    }
    setNftNum(oldState => oldState + 100)
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <div className="w-2/5 grid-flow-row">
          <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/2"} onClick={
            () => {
              if (fetchForCollection) {
                fetchNFTsForCollection()
              } else fetchNFTs()
            }
          }>Let's go! </button>
          <button className={"disabled:bg-slate-500 text-white bg-red-400 px-4 py-2 mt-3 rounded-sm w-1/2"} onClick={
            () => {
              if (fetchForCollection) {
                fetchNFTsForCollection()
              } else fetchNFTs()
            }
          }>Load 100 more</button>
        </div>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {diplayNfts}
      </div>
      <div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </div>
    </div>
  )
}

export default Home