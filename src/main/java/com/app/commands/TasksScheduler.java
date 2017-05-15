package com.app.commands;

import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.repositories.SuburbRepository;
import com.app.repositories.TypeRepository;

import org.springframework.stereotype.Service;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Andrea on 29/03/2017.
 */
@Service
public class TasksScheduler {

    /**
     * Instantiates a new Tasks scheduler.
     *
     * @param buildingRepository the building repository
     * @param cityRepository     the city repository
     * @param suburbRepository   the suburb repository
     * @param addressRepository  the address repository
     * @param typeRepository     the type repository
     */
    public TasksScheduler(BuildingRepository buildingRepository, CityRepository cityRepository, SuburbRepository suburbRepository, AddressRepository addressRepository, TypeRepository typeRepository) {
        Timer updateTimer = new Timer();
        ConverterCommand converterCommand = new ConverterCommand(buildingRepository, addressRepository);
        CityLoaderCommand cityLoaderCommand = new CityLoaderCommand(buildingRepository, cityRepository, addressRepository);
        CityInformationCommand cityInformationCommand = new CityInformationCommand(addressRepository, typeRepository, suburbRepository, buildingRepository);

        TimerTask myLoadLuganoTask = new TimerTask() {
            @Override
            public void run() {
                cityLoaderCommand.loadLuganoTask();
            }
        };
        updateTimer.schedule(myLoadLuganoTask, 5000);

        TimerTask myConverterTask = new TimerTask() {
            @Override
            public void run() {
                converterCommand.converterTask();
            }
        };
        updateTimer.schedule(myConverterTask, 6000);

        TimerTask myInformationSuburbTaskSwissTopo = new TimerTask() {
            @Override
            public void run() {
                cityInformationCommand.informationSuburbTaskFromSwissTopo();
            }
        };
//        updateTimer.schedule(myInformationSuburbTaskSwissTopo, 7000);

        TimerTask myInformationAddressTaskSwissTopo = new TimerTask() {
            @Override
            public void run() {
                cityInformationCommand.informationAddressTaskFromSwissTopo();
            }
        };
//        updateTimer.schedule(myInformationAddressTaskSwissTopo, 8000);


        TimerTask myInformationTaskOsm = new TimerTask() {
            @Override
            public void run() {
                cityInformationCommand.informationTaskFromOsm();
            }
        };
//        updateTimer.schedule(myInformationTaskOsm, 7000);


    }
}
