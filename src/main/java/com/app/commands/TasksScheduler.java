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

    public TasksScheduler(BuildingRepository buildingRepository, CityRepository cityRepository, SuburbRepository suburbRepository, AddressRepository addressRepository, TypeRepository typeRepository) {
        Timer updateTimer = new Timer();
        ConverterCommand converterCommand = new ConverterCommand(buildingRepository, addressRepository);
        CityLoaderCommand cityLoaderCommand = new CityLoaderCommand(buildingRepository, cityRepository, addressRepository);
        CityInformationCommand cityInformationCommand = new CityInformationCommand(buildingRepository, addressRepository, typeRepository);

        TimerTask myConverterTask = new TimerTask() {
            @Override
            public void run() {
                converterCommand.converterTask();
            }
        };
//        updateTimer.schedule(myConverterTask, 20000);


        TimerTask myInformationTask = new TimerTask() {
            @Override
            public void run() {
                cityInformationCommand.informationTask();
            }
        };
//        updateTimer.schedule(myInformationTask, 30000, 86460000);
//        updateTimer.schedule(myInformationTask, 5000);


        TimerTask myLoadLuganoTask = new TimerTask() {
            @Override
            public void run() {
                cityLoaderCommand.loadLuganoTask();
            }
        };
//        updateTimer.schedule(myLoadLuganoTask, 5000);
    }
}
