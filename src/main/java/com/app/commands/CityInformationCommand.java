package com.app.commands;

import com.app.API.SwissTopo.SwissTopoAPI;
import com.app.API.SwissTopo.SwissTopoAPIServices;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Suburb;
import com.app.models.Type;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.SuburbRepository;
import com.app.repositories.TypeRepository;

import org.jetbrains.annotations.NotNull;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Created by Andrea on 14/04/2017.
 */
public class CityInformationCommand {
    private final AddressRepository addressRepository;
    private final TypeRepository typeRepository;
    private final SuburbRepository suburbRepository;
    private final BuildingRepository buildingRepository;
    private SwissTopoAPIServices swissTopo;

    /**
     * Instantiates a new City information command.
     *
     * @param addressRepository  the address repository
     * @param typeRepository     the type repository
     * @param suburbRepository   the suburb repository
     * @param buildingRepository the building repository
     */
    public CityInformationCommand(AddressRepository addressRepository, TypeRepository typeRepository, SuburbRepository suburbRepository, BuildingRepository buildingRepository) {
        this.addressRepository = addressRepository;
        this.typeRepository = typeRepository;
        this.suburbRepository = suburbRepository;
        this.buildingRepository = buildingRepository;
        this.swissTopo = new SwissTopoAPI();
    }


    @Scheduled
    public void informationSuburbTaskFromSwissTopo() {
        System.out.println("Updating Suburbs from SwissTopo...");
        List<Building> buildings = buildingRepository.findAll();
        for (Building building : buildings) {
            String swissCoords = new String(building.getRingSwissCoords());
            String[] firstCoordPoint = swissCoords.split(",")[0].split(" ");

            String suburbName = swissTopo.coordinateToSuburb(firstCoordPoint[0], firstCoordPoint[1]);

            this.handleSuburb(building, suburbName);
            System.out.println("Updating building " + building.getId());
            buildingRepository.save(building);

        }
        System.out.println("Suburbs updated!");
    }

    /**
     * Information task from swiss topo.
     */
    @Scheduled
    public void informationAddressTaskFromSwissTopo() {
        Optional<List<Address>> nullAddresses = Optional.ofNullable(addressRepository.findAddressByAddressNameIsNull());
        if (nullAddresses.isPresent() && nullAddresses.get().size() > 81) {
            System.out.println("Updating Addresses from SwissTopo...");
            List<Building> egidBuildings = buildingRepository.findBuildingsByEgidUcaIsNotNull();
            for (Building building : egidBuildings) {
                Optional<Address> address = addressRepository.findAddressByLatitudeAndLongitudeAndOwnBuilding_Id(building.getCentroidLat(), building.getCentroidLng(), building.getId());
                if (address.isPresent()) {
                    org.json.JSONObject buildingInformation = swissTopo.egidToBuildingAddress(building.getEgidUca());
                    if (buildingInformation != null) {
                        address.get().setHouseNumber(!buildingInformation.isNull("deinr") ? buildingInformation.getString("deinr") : address.get().getHouseNumber());
                        address.get().setAddressName(!buildingInformation.isNull("strname1") ? buildingInformation.getString("strname1") : address.get().getAddressName());

//                    String suburbName = !buildingInformation.isNull("plzname") ? buildingInformation.getString("plzname") : null;
//                    if (suburbName != null && !suburbName.equals(building.getCity().getName())) {
//                        this.handleSuburb(address.get(), suburbName);
//                    }
                        System.out.println("Updating address " + address.get().getBuilding().getId());
                        addressRepository.save(address.get());
                    }
                }

            }
        }
        System.out.println("Addresses updated!");
    }

    /**
     * Information task from osm.
     */
    @Scheduled
    public void informationTaskFromOsm() {
        Optional<List<Address>> nullAddresses = Optional.ofNullable(addressRepository.findAddressByAddressNameIsNull());
        System.out.println("Updating Addresses and Types from OSM...");
        if (nullAddresses.isPresent() && nullAddresses.get().size() > 81) {
            JSONParser parser = new JSONParser();
            JSONArray infoArray;
            try {
                File dir = new File("src/main/resources/city_data/");
                File[] directoryListing = dir.listFiles();
                if (directoryListing != null) {
                    for (Address address : nullAddresses.get()) {
                        outerloop:
                        for (File child : directoryListing) {
                            if (!Objects.equals(child.getName(), "lugano.xml") && !Objects.equals(child.getName(), ".DS_Store")) {
                                infoArray = (JSONArray) parser.parse(new FileReader("src/main/resources/city_data/" + child.getName()));
                                for (Object addressInfo : infoArray) {
                                    JSONObject jsonAddressInfo = (JSONObject) addressInfo;

                                    Long building_ID = (Long) jsonAddressInfo.get("Building_ID");
                                    Double latitude = (Double) jsonAddressInfo.get("latitude");
                                    Double longitude = (Double) jsonAddressInfo.get("longitude");

                                    if (address.getBuilding().getId().equals(building_ID) && address.getLatitude().equals(latitude) && address.getLongitude().equals(longitude)) {
                                        JSONObject OSMInfo = (JSONObject) jsonAddressInfo.get("OSMInfo");
                                        JSONObject addresses = (JSONObject) OSMInfo.get("address");

                                        for (Object addressKey : addresses.keySet()) {
                                            switch (addressKey.toString()) {
                                                case "house_number":
                                                    if (address.getHouseNumber() == null) {
                                                        address.setHouseNumber(addresses.get(addressKey).toString());
                                                    }
                                                    break;
                                                case "road":
                                                    address.setAddressName(saveRoadName(address, addressKey, addresses));
                                                    break;
                                                case "pedestrian":
                                                    address.setAddressName(saveRoadName(address, addressKey, addresses));
                                                    break;
                                                case "footway":
                                                    address.setAddressName(saveRoadName(address, addressKey, addresses));
                                                    break;
                                                case "path":
                                                    address.setAddressName(saveRoadName(address, addressKey, addresses));
                                                    break;
                                                case "county":
                                                    break;
                                                case "neighbourhood":
                                                    break;
                                                case "state":
                                                    break;
                                                case "city":
                                                    break;
                                                case "information":
                                                    break;
                                                case "country":
                                                    break;
                                                case "town":
                                                    break;
                                                case "postcode":
                                                    break;
                                                case "country_code":
                                                    break;
                                                case "suburb":
//                                                    this.handleSuburb(address, addresses.get(addressKey).toString());
                                                    break;
                                                default:
                                                    address.addType(handleType(address, addressKey.toString()));
                                                    break;
                                            }
                                        }
                                        System.out.println("Updating address " + address.getBuilding().getId());
                                        addressRepository.save(address);
                                        break outerloop;
                                    }
                                }
                            }
                        }
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        System.out.println("Addresses and Types updated!");
    }

    private String saveRoadName(Address address, Object addressKey, JSONObject addresses) {
        if (address.getRoadNumber() != null && address.getAddressName() == null) {
            List<Address> addressesFromRoadNumber = addressRepository.findAddressByRoadNumber(address.getRoadNumber());
            Collection<Address> updatedAddresses = new ArrayList<>();
            for (Address addressFromRoadNumber : addressesFromRoadNumber) {
                addressFromRoadNumber.setAddressName(addresses.get(addressKey).toString());
                updatedAddresses.add(addressFromRoadNumber);
            }
            addressRepository.save(updatedAddresses);
        }
        return addresses.get(addressKey).toString();
    }

    @NotNull
    private Type handleType(Address address, String addressName) {
        Optional<Type> type = typeRepository.findTypeByTypeName(addressName);
        if (!type.isPresent()) {
            type = Optional.of(new Type(addressName));
        }
        return typeRepository.save(type.get());
    }

//    private void handleSuburbFromAddress(Address address, String suburbName) {
//        Optional<Suburb> suburb = suburbRepository.findSuburbByName(suburbName);
//        if (!suburb.isPresent()) {
//            suburb = Optional.of(new Suburb(address.getBuilding().getCity(), suburbName));
//        }
//        address.getBuilding().setSuburb(suburb.get());
//    }

    private void handleSuburb(Building building, String suburbName) {
        Optional<Suburb> suburb = suburbRepository.findSuburbByName(suburbName);
        if (!suburb.isPresent()) {
            suburb = Optional.of(new Suburb(building.getCity(), suburbName));
        }
        building.setSuburb(suburb.get());
    }
}