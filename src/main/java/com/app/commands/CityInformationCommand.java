package com.app.commands;

import com.app.API.OpenStreetMap.LocationInfo;
import com.app.API.OpenStreetMap.OpenStreetMapAPIServices;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Type;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.TypeRepository;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.io.FileReader;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Created by Andrea on 14/04/2017.
 */
public class CityInformationCommand {
    private final BuildingRepository buildingRepository;
    private final AddressRepository addressRepository;
    private final TypeRepository typeRepository;


    public CityInformationCommand(BuildingRepository buildingRepository, AddressRepository addressRepository, TypeRepository typeRepository) {
        this.buildingRepository = buildingRepository;
        this.addressRepository = addressRepository;
        this.typeRepository = typeRepository;
    }

    @Scheduled
    public void informationTask() {
        List<Building> buildings = this.buildingRepository.findAll();
        OpenStreetMapAPIServices services = new LocationInfo();

        JSONParser parser = new JSONParser();
        JSONArray a;
        try {
            System.out.println("Updating Addresses and Types...");
            File dir = new File("src/main/resources/city_data/");
            File[] directoryListing = dir.listFiles();
            if (directoryListing != null) {
                for (File child : directoryListing) {
                    if (!Objects.equals(child.getName(), "lugano.xml") && !Objects.equals(child.getName(), ".DS_Store")) {
                        a = (JSONArray) parser.parse(new FileReader("src/main/resources/city_data/" + child.getName()));
                        for (Object o : a) {
                            JSONObject person = (JSONObject) o;

                            Long Building_ID = (Long) person.get("Building_ID");
                            Double latitude = (Double) person.get("latitude");
                            Double longitude = (Double) person.get("longitude");

                            Optional<Address> address = addressRepository.findAddressByIdAndLatitudeAndLongitude(Building_ID, latitude, longitude);
                            if (address.isPresent()) {
                                JSONObject OSMInfo = (JSONObject) person.get("OSMInfo");

                                JSONObject addresses = (JSONObject) OSMInfo.get("address");

                                for (Object o1 : addresses.keySet()) {
                                    switch (o1.toString()) {
                                        case "house_number":
                                            if (address.get().getHouseNumber() == null) {
                                                address.get().setHouseNumber(addresses.get(o1).toString());
                                            }
                                            break;
                                        case "road":
                                            address.get().setAddressName(saveRoadName(address.get(), o1, addresses));
                                            break;
                                        case "pedestrian":
                                            address.get().setAddressName(saveRoadName(address.get(), o1, addresses));
                                            break;
                                        case "footway":
                                            address.get().setAddressName(saveRoadName(address.get(), o1, addresses));
                                            break;
                                        case "path":
                                            address.get().setAddressName(saveRoadName(address.get(), o1, addresses));
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
                                            break;
                                        default:
                                            address.get().addType(handleType(address.get(), o1));
                                    }
                                }
                                addressRepository.save(address.get());
                            }
                        }
                    }
                }
            }
            System.out.println("Addresses and Types updated!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String saveRoadName(Address address, Object o1, JSONObject addresses) {
        if (address.getRoadNumber() != null && address.getAddressName() == null) {
            List<Address> addressesForRoadNumber = addressRepository.findAddressByRoadNumber(address.getRoadNumber());
            for (Address addressForRoadNumber : addressesForRoadNumber) {
                addressForRoadNumber.setAddressName(addresses.get(o1).toString());
                addressRepository.save(addressForRoadNumber);
            }
        }
        return addresses.get(o1).toString();
    }

    private Type handleType(Address address, Object o1) {
        Optional<Type> type = typeRepository.findTypeByTypeName(o1.toString());
        if (!type.isPresent()) {
            type = Optional.of(new Type(o1.toString()));
        }
        address.addType(type.get());
        return typeRepository.save(type.get());
    }
}
