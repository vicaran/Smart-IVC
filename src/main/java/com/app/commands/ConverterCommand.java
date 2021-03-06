package com.app.commands;

import com.app.models.Address;
import com.app.models.Building;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.utils.OnlineConverter;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * The type Converter command.
 */
@Service
public class ConverterCommand {
    private final BuildingRepository buildingRepository;
    private final AddressRepository addressRepository;
    private OnlineConverter onlineConverter;


    /**
     * Instantiates a new Converter command.
     *
     * @param buildingRepository the building repository
     * @param addressRepository  the address repository
     */
    public ConverterCommand(BuildingRepository buildingRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.addressRepository = addressRepository;
        onlineConverter = new OnlineConverter();
    }

    /**
     * Converter task.
     */
    @Scheduled
    public void converterTask() {
        List<Building> buildings = this.buildingRepository.findBuildingsByOwnCityCountry("Switzerland");
        boolean ringUpdated = false;
        boolean boundUpdated = false;
        boolean centroidUpdated = false;

        for (Building building : buildings) {
            // Convert Ring from CH to Global Coordinates
            if (building.getRingGlobalCoords() == null) {
                ringUpdated = true;
                building = onlineConverter.convertBuildingRingCHtoWGS(building, building.getRingSwissCoords());
            }

            // Convert Bounds from CH to Global Coordinates
            String firstBoudCoord = new String(building.getBoundCoords()).split(" ")[0];
            if (Double.parseDouble(firstBoudCoord) >= 90) {
                boundUpdated = true;
                building = onlineConverter.convertBuildingRingCHtoWGS(building, building.getBoundCoords());
            }

            // Convert Centroid
            List<Address> addresses = new ArrayList<>();
            if (building.getCentroidLat() >= 90 && building.getCentroidLng() >= 180) {
                centroidUpdated = true;
                building = onlineConverter.convertBuildingCentroidCHtoWGS(building);
                List<Address> buildingAddresses = new ArrayList<>();
                building.setAddresses(addressRepository.findAddressByOwnBuilding(building));
                for (Address address : building.getAddresses()) {
                    Address convertedResult = onlineConverter.convertAddressCoordinatesCHtoWGS(address);
                    buildingAddresses.add(convertedResult);
                    addresses.add(convertedResult);
                }
                building.setAddresses(buildingAddresses);
            }

            // Save updated values
            if (ringUpdated || centroidUpdated || boundUpdated) {
                this.saveModels(building, addresses);
            }
        }
        System.out.println("\tRing Coordinates Updated from SwissTopo: " + ringUpdated + ".");
        System.out.println("\tBound Coordinates Updated from SwissTopo: " + boundUpdated + ".");
        System.out.println("\tCentroid Coordinates Updated SwissTopo: " + centroidUpdated + ".");
    }

    private void saveModels(Building building, List<Address> addresses){
        buildingRepository.save(building);
        addressRepository.save(addresses);
        System.out.println("\t\tBuilding " + building.getId() + " saved!");
    }
}
