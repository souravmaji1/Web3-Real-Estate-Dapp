google map api key: AIzaSyCloLTxoIFVUjX51SDW8i8z5MazP8IUCQI
mapbox api; pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHM1dTJ0MGExZzgxMmtvZTA5MWs0ZXFnIn0.RkjKD84lnE10iZwNjOtx5w

 <Map
          mapboxAccessToken='pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHM1dTJ0MGExZzgxMmtvZTA5MWs0ZXFnIn0.RkjKD84lnE10iZwNjOtx5w'
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: selectedLand.longitude,
          latitude: selectedLand.latitude,
          zoom: 3.5
        }}
        style={{width: 600, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
     